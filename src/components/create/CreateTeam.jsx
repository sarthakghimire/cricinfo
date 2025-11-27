import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeam } from "../../api/api";
import { toast } from "react-hot-toast";

const CreateTeam = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: "",
    slogan: "",
    description: "",
    logo: "",
    banner_image: "",
    players: [],
  });

  const mutation = useMutation({
    mutationFn: createTeam,
    onSuccess: (data) => {
      toast.success(`${data.name} created successfully!`);
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      setFormData({
        name: "",
        slogan: "",
        description: "",
        logo: "",
        banner_image: "",
        players: [],
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create team");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlayersChange = (e) => {
    const value = e.target.value;
    const playerIds = value
      .split(",")
      .map((id) => id.trim())
      .filter((id) => id.length === 24);

    setFormData((prev) => ({ ...prev, players: playerIds }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    mutation.mutate({
      name: formData.name.trim(),
      slogan: formData.slogan.trim(),
      description: formData.description.trim(),
      logo: formData.logo.trim(),
      banner_image: formData.banner_image.trim(),
      players: formData.players.length > 0 ? formData.players : [],
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Team</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Team Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Team Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Sudurpaschim Royals"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        {/* Slogan */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Slogan
          </label>
          <input
            type="text"
            name="slogan"
            value={formData.slogan}
            onChange={handleChange}
            placeholder="e.g. Unite, Strike, Conquer"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="Short description about the team..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Logo URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Logo URL
          </label>
          <input
            type="url"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Banner Image URL */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Banner Image URL
          </label>
          <input
            type="url"
            name="banner_image"
            value={formData.banner_image}
            onChange={handleChange}
            placeholder="https://example.com/banner.jpg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Players */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Player IDs (comma-separated)
          </label>
          <input
            type="text"
            value={formData.players.join(", ")}
            onChange={handlePlayersChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Current: {formData.players.length} players added
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-linear-to-r from-blue-600 to-indigo-700 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Creating Team..." : "Create Team"}
        </button>
      </form>
    </div>
  );
};

export default CreateTeam;
