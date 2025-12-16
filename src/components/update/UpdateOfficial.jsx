import { useState, useEffect } from "react";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useOfficials } from "../../hooks/officials/useOfficials";
import { useOfficial } from "../../hooks/officials/useOfficial";
import { useUpdateOfficial } from "../../hooks/officials/useUpdateOfficial";

const UpdateOfficial = () => {
  const [selectedOfficialId, setSelectedOfficialId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    type: "umpire",
    description: "",
  });

  // Fetch officials
  const { data: response, isLoading: loadingOfficials } = useOfficials(1, 100);
  const officials = response?.data || [];

  // Fetch single official
  const { data: official, isLoading: loadingOne } =
    useOfficial(selectedOfficialId);

  useEffect(() => {
    if (official) {
      setFormData({
        name: official.name || "",
        type: official.type || "umpire",
        description: official.description || "",
      });
    }
  }, [official]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const mutation = useUpdateOfficial();

  const handleSubmit = (e) => {
    e.preventDefault();

    const updates = {};

    if (formData.name.trim() !== official?.name) {
      updates.name = formData.name.trim();
    }
    if (formData.type !== official?.type) {
      updates.type = formData.type;
    }
    if (formData.description !== official?.description) {
      updates.description = formData.description.trim() || undefined;
    }

    if (Object.keys(updates).length === 0) {
      return toast("No changes to save", { icon: "Info" });
    }

    mutation.mutate(
      { id: selectedOfficialId, data: updates },
      {
        onSuccess: () => {
          toast.success(`${official.name} updated successfully!`);
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to update official"
          );
        },
      }
    );
  };

  if (loadingOfficials) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Select Official Card */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Select Official to Update
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
          {officials.map((o) => (
            <label
              key={o._id}
              className={`flex items-center space-x-3 cursor-pointer p-4 rounded-lg border transition-all ${
                selectedOfficialId === o._id
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                  : "border-gray-200 hover:bg-gray-50 hover:border-blue-400"
              }`}
            >
              <input
                type="radio"
                name="official"
                value={o._id}
                checked={selectedOfficialId === o._id}
                onChange={(e) => setSelectedOfficialId(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <div className="min-w-0">
                <p className="font-medium text-gray-800 truncate">{o.name}</p>
                <p className="text-xs text-gray-500 capitalize">{o.type}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Edit Form */}
      {selectedOfficialId && official && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Official Details</h2>
            
          {loadingOne ? (
            <div className="text-center py-8"><Loading /></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="umpire">Umpire</option>
                  <option value="referee">Referee</option>
                  <option value="scorer">Scorer</option>
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
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? "Updating..." : "Update Official"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default UpdateOfficial;
