import { useState } from "react";
import { toast } from "react-hot-toast";
import { useCreatePlayer } from "../../hooks/players/useCreatePlayer";

const CreatePlayer = () => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    date_of_birth: "",
    image: "",
  });

  const mutation = useCreatePlayer();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData, {
      onSuccess: () => {
        toast.success("Player created successfully!");
        setFormData({ name: "", gender: "", date_of_birth: "", image: "" });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to create player");
      },
    });
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
          className="w-full bg-linear-to-r from-blue-600 to-indigo-700 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Creating..." : "Create Player"}
        </button>
      </form>
    </div>
  );
};

export default CreatePlayer;
