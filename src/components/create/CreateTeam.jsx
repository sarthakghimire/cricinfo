import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Loading from "../animation/Loading";
import { useTeams } from "../../hooks/teams/useTeams";
import { usePlayers } from "../../hooks/players/usePlayers";
import { useCreateTeam } from "./../../hooks/teams/useCreateTeam";

const CreateTeam = () => {
  const [formData, setFormData] = useState({
    name: "",
    slogan: "",
    description: "",
    logo: "",
    banner_image: "",
    players: [],
  });

  // Fetch all players
  const { data: playersRes, isLoading: loadingPlayers } = usePlayers(1, 100);

  // Fetch all teams to know which players are already taken
  const { data: teamsRes } = useTeams();

  const allPlayers = playersRes?.data || [];
  const allTeams = teamsRes?.data || [];

  // Get all player IDs already used in any team
  const usedPlayerIds = new Set();
  allTeams.forEach((team) => {
    team.players?.forEach((p) => usedPlayerIds.add(p._id || p));
  });

  // Available players = all players - already used ones
  const availablePlayers = allPlayers.filter((p) => !usedPlayerIds.has(p._id));

  const mutation = useCreateTeam();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlayersChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedIds = selectedOptions.map((opt) => opt.value);
    setFormData((prev) => ({ ...prev, players: selectedIds }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    mutation.mutate(
      {
        name: formData.name.trim(),
        slogan: formData.slogan.trim() || undefined,
        description: formData.description.trim() || undefined,
        logo: formData.logo.trim() || undefined,
        banner_image: formData.banner_image.trim() || undefined,
        players: formData.players,
      },
      {
        onSuccess: () => {
          toast.success("Team created successfully!");
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
      }
    );
  };

  if (loadingPlayers) return <Loading />;

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 mt-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Create New Team
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Team Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Team Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Sudurpaschim Royals"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Slogan & Description */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Slogan
            </label>
            <input
              type="text"
              name="slogan"
              value={formData.slogan}
              onChange={handleChange}
              placeholder="Unite, Strike, Conquer"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Logo URL
            </label>
            <input
              type="url"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Banner Image URL
          </label>
          <input
            type="url"
            name="banner_image"
            value={formData.banner_image}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="About the team..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Multi-Select Players */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Players <span className="text-red-500">*</span>
          </label>
          <select
            multiple
            value={formData.players}
            onChange={handlePlayersChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-48 text-sm"
          >
            {availablePlayers.length === 0 ? (
              <option disabled>All players are already in teams</option>
            ) : (
              availablePlayers.map((player) => (
                <option key={player._id} value={player._id}>
                  {player.name} ({player.gender === "M" ? "Male" : "Female"})
                </option>
              ))
            )}
          </select>
          <p className="text-xs text-gray-500 mt-2">
            Hold <kbd>Ctrl</kbd> (or <kbd>Cmd</kbd>) to select multiple ·{" "}
            <strong>{formData.players.length}</strong> selected ·{" "}
            <strong>{availablePlayers.length}</strong> available
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition transform hover:scale-105 disabled:scale-100"
        >
          {mutation.isPending ? "Creating Team..." : "Create Team"}
        </button>
      </form>
    </div>
  );
};

export default CreateTeam;
