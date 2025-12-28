import { useState, useEffect } from "react";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useTournamentTypes } from "../../hooks/tournaments/useTournamentTypes";
import { useTournamentType } from "../../hooks/tournaments/useTournamentType";
import { useUpdateTournamentType } from "../../hooks/tournaments/useUpdateTournamentType";

const UpdateTournamentType = () => {
  const [selectedId, setSelectedId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const { data: response, isLoading: loadingList } = useTournamentTypes();
  const tournamentTypes = response?.data || [];

  const { data: tournamentType, isLoading: loadingOne } =
    useTournamentType(selectedId);

  useEffect(() => {
    if (tournamentType) {
      const typeData = tournamentType.data;
      setFormData({
        name: typeData.name || "",
        description: typeData.description || "",
      });
    } else if (selectedId) {
      setFormData({
        name: "",
        description: "",
      });
    }
  }, [tournamentType, selectedId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const mutation = useUpdateTournamentType();

  const handleSubmit = (e) => {
    e.preventDefault();

    const updates = {};

    if (formData.name.trim() !== tournamentType?.data?.name)
      updates.name = formData.name.trim();
    if (formData.description !== (tournamentType?.data?.description || ""))
      updates.description = formData.description || undefined;

    if (Object.keys(updates).length === 0) {
      toast("No changes detected", { icon: "ℹ️" });
      return;
    }

    mutation.mutate(
      { id: selectedId, data: updates },
      {
        onSuccess: () => toast.success("Tournament type updated successfully!"),
        onError: (err) =>
          toast.error(err.response?.data?.message || "Failed to update"),
      }
    );
  };

  if (loadingList) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Select Tournament Type Card */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Select Tournament Type to Update
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
          {tournamentTypes.map((type) => (
            <label
              key={type._id}
              className={`flex items-center space-x-3 cursor-pointer p-4 rounded-lg border transition-all ${
                selectedId === type._id
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                  : "border-gray-200 hover:bg-gray-50 hover:border-blue-400"
              }`}
            >
              <input
                type="radio"
                name="tournamentType"
                value={type._id}
                checked={selectedId === type._id}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-gray-800">{type.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Edit Form */}
      {selectedId && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Update Tournament Type Details
          </h2>

          {loadingOne ? (
            <div className="text-center py-8">
              <Loading />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
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
                    Description
                  </label>
                  <input
                    name="description"
                    type="text"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Optional description"
                  />
                </div>
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? "Updating..." : "Update Tournament Type"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default UpdateTournamentType;
