import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFormat } from "../../api/api";
import { toast } from "react-hot-toast";

const CreateFormat = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    total_overs: "",
    balls_per_over: "6",
    power_play_overs: "",
  });

  const mutation = useMutation({
    mutationFn: addFormat,
    onSuccess: () => {
      toast.success("Format created successfully!");
      queryClient.invalidateQueries({ queryKey: ["formats"] });
      setFormData({
        name: "",
        description: "",
        total_overs: "",
        balls_per_over: "6",
        power_play_overs: "",
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create format");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      name: formData.name,
      description: formData.description,
      total_overs: Number(formData.total_overs),
      balls_per_over: Number(formData.balls_per_over),
      power_play_overs: Number(formData.power_play_overs),
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Format</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Total Overs</label>
          <input
            type="number"
            name="total_overs"
            value={formData.total_overs}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Balls per Over
          </label>
          <input
            type="number"
            name="balls_per_over"
            value={formData.balls_per_over}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            min="1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Powerplay Overs
          </label>
          <input
            type="number"
            name="power_play_overs"
            value={formData.power_play_overs}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
        >
          {mutation.isPending ? "Creating..." : "Create Format"}
        </button>
      </form>
    </div>
  );
};

export default CreateFormat;
