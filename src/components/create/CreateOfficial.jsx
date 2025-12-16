import { useState } from "react";
import { toast } from "react-hot-toast";
import { useCreateOfficial } from "../../hooks/officials/useCreateOfficial";

const officialTypes = [
  { value: "umpire", label: "Umpire" },
  { value: "match_refree", label: "Match Referee" },
  { value: "tv_umpire", label: "TV Umpire" },
  { value: "reserve_umpire", label: "Reserve Umpire" },
];

const CreateOfficial = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "umpire",
    description: "",
  });

  const mutation = useCreateOfficial();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.error("Name is required");

    mutation.mutate(
      {
        name: formData.name.trim(),
        type: formData.type,
        description: formData.description.trim() || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Official created successfully!");
          setFormData({ name: "", type: "umpire", description: "" });
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to create official"
          );
        },
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Add New Official
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name
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
            Official Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {officialTypes.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
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
            placeholder="Elite panel umpire from Sri Lanka..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition transform hover:scale-105 disabled:scale-100"
        >
          {mutation.isPending ? "Creating..." : "Create Official"}
        </button>
      </form>
    </div>
  );
};

export default CreateOfficial;
