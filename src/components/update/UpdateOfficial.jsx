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
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h2 className="text-4xl font-extrabold text-center bg-linear-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
        Update Official
      </h2>

      {/* Selection Grid */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Select Official to Edit
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
          {officials.map((o) => (
            <label
              key={o._id}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-4 rounded-lg border transition hover:border-blue-300"
            >
              <input
                type="radio"
                name="official"
                value={o._id}
                checked={selectedOfficialId === o._id}
                onChange={(e) => setSelectedOfficialId(e.target.value)}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-800 truncate">
                  {o.name}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Edit Form */}
      {selectedOfficialId && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          {loadingOne ? (
            <div className="text-center py-12">
              <Loading />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <h3 className="text-2xl font-bold text-center text-gray-800">
                Editing: <span className="text-blue-600">{official?.name}</span>
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 text-lg"
                  >
                    <option value="umpire">Umpire</option>
                    <option value="match_refree">Match Referee</option>
                    <option value="third_umpire">Third Umpire</option>
                    <option value="tv_umpire">TV Umpire</option>
                    <option value="reserve_umpire">Reserve Umpire</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="e.g. Elite panel umpire from ICC."
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg resize-none"
                  />
                </div>
              </div>

              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-linear-to-r from-blue-600 to-indigo-700 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                >
                  {mutation.isPending ? "Saving Changes..." : "Update Official"}
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
