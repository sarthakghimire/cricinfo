import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTeam } from "../api/api";
import { toast } from "react-hot-toast";

const CreateTeam = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    slogan: "",
    description: "",
    players: "",
  });

  const mutation = useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      toast.success("Team created!");
      queryClient.invalidateQueries(["teams"]);
      setFormData({ name: "", slogan: "", description: "", players: "" });
    },
    onError: () => {
      toast.error("Failed to create team");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      name: formData.name,
      slogan: formData.slogan,
      description: formData.description,
      players: formData.players
        ? formData.players.split(",").map((id) => id.trim())
        : [],
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <h2 className="text-lg font-bold">Create Team</h2>
        <div>
          <label className="block">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-1 border"
            required
          />
        </div>
        <div>
          <label className="block">Slogan</label>
          <input
            type="text"
            name="slogan"
            value={formData.slogan}
            onChange={handleChange}
            className="w-full p-1 border"
          />
        </div>
        <div>
          <label className="block">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-1 border"
          />
        </div>
        <div>
          <label className="block">Players (comma-separated IDs)</label>
          <input
            type="text"
            name="players"
            value={formData.players}
            onChange={handleChange}
            className="w-full p-1 border"
            placeholder="player1,player2"
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="p-1 bg-blue-500 text-white disabled:bg-gray-300"
        >
          {mutation.isPending ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
};

export default CreateTeam;
