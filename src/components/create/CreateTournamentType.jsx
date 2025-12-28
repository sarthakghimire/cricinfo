import { useState } from "react";
import { toast } from "react-hot-toast";
import { useCreateTournamentType } from "../../hooks/tournaments/useCreateTournamentType";

const CreateTournamentType = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const mutation = useCreateTournamentType();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(
      {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Tournament type created successfully!");
          setFormData({ name: "", description: "" });
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to create tournament type"
          );
        },
      }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Create Tournament Type
      </h2>

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
            placeholder="Optional description"
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition transform hover:scale-105 disabled:scale-100"
        >
          {mutation.isPending ? "Creating..." : "Create Tournament Type"}
        </button>
      </form>
    </div>
  );
};

export default CreateTournamentType;
