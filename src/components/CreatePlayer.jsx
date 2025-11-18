import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPlayer } from "../api/api";
import { toast } from "react-hot-toast";

const CreatePlayer = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    date_of_birth: "",
    image: "",
  });

  const mutation = useMutation({
    mutationFn: (data) => createPlayer(data),
    onSuccess: () => {
      toast.success("Player created!");
      queryClient.invalidateQueries(["players"]);
      setFormData({ name: "", gender: "", date_of_birth: "", image: "" });
    },
    onError: (error) => {
      toast.error(`Failed to create player: ${error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-lg font-bold">Create Player</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Gender(M/F/O)
          </label>
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
        >
          {mutation.isPending ? "Creating..." : "Create Player"}
        </button>
      </form>
    </div>
  );
};

export default CreatePlayer;
