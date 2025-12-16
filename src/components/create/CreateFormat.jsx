import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useCreateMatchType } from "../../hooks/matchTypes/useCreateMatchType";

const CreateFormat = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    total_overs: "",
    balls_per_over: "6",
    power_play_overs: "",
  });

  const mutation = useCreateMatchType();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    mutation.mutate(
      {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        total_overs: Number(formData.total_overs),
        balls_per_over: Number(formData.balls_per_over),
        power_play_overs: Number(formData.power_play_overs),
      },
      {
        onSuccess: () => {
          toast.success("Match format created successfully!");
          setFormData({
            name: "",
            description: "",
            total_overs: "",
            balls_per_over: "6",
            power_play_overs: "",
          });
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to create format"
          );
        },
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Format</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Total Overs
          </label>
          <input
            type="number"
            name="total_overs"
            value={formData.total_overs}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Balls per Over
          </label>
          <input
            type="number"
            name="balls_per_over"
            value={formData.balls_per_over}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Powerplay Overs
          </label>
          <input
            type="number"
            name="power_play_overs"
            value={formData.power_play_overs}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition transform hover:scale-105 disabled:scale-100"
        >
          {mutation.isPending ? "Creating..." : "Create Format"}
        </button>
      </form>
    </div>
  );
};

export default CreateFormat;
