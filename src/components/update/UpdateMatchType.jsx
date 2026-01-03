import { useState, useEffect } from "react";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useMatchTypes } from "../../hooks/matchTypes/useMatchTypes";
import { useMatchType } from "../../hooks/matchTypes/useMatchType";
import { useUpdateMatchType } from "../../hooks/matchTypes/useUpdateMatchType";

const UpdateMatchType = () => {
  const [selectedId, setSelectedId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    total_overs: "",
    balls_per_over: "",
    power_play_overs: "",
  });

  const { data: response, isLoading: loadingList } = useMatchTypes();
  const matchTypes = response?.data || [];

  const { data: matchType, isLoading: loadingOne } = useMatchType(selectedId);

  // THIS IS THE MAGIC LINE — forces re-run when ID changes
  useEffect(() => {
    if (matchType) {
      const playerData = matchType.data;
      setFormData({
        name: playerData.name || "",
        description: playerData.description || "",
        total_overs:
          playerData.total_overs != null ? String(playerData.total_overs) : "",
        balls_per_over:
          playerData.balls_per_over != null
            ? String(playerData.balls_per_over)
            : "6",
        power_play_overs:
          playerData.power_play_overs != null
            ? String(playerData.power_play_overs)
            : "",
      });
    } else if (selectedId) {
      // Reset form if no data (rare case)
      setFormData({
        name: "",
        description: "",
        total_overs: "",
        balls_per_over: "6",
        power_play_overs: "",
      });
    }
  }, [matchType, selectedId]); // ← DEPENDENCY ADDED: selectedId

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const mutation = useUpdateMatchType();

  const handleSubmit = (e) => {
    e.preventDefault();

    const updates = {};

    if (formData.name.trim() !== matchType?.name)
      updates.name = formData.name.trim();
    if (formData.description !== matchType?.description)
      updates.description = formData.description || undefined;
    if (Number(formData.total_overs || 0) !== (matchType?.total_overs || 0))
      updates.total_overs = Number(formData.total_overs);
    if (
      Number(formData.balls_per_over || 6) !== (matchType?.balls_per_over || 6)
    )
      updates.balls_per_over = Number(formData.balls_per_over || 6);
    if (
      Number(formData.power_play_overs || 0) !==
      (matchType?.power_play_overs || 0)
    )
      updates.power_play_overs = Number(formData.power_play_overs || 0);

    if (Object.keys(updates).length === 0) {
      toast("No changes detected", { icon: "Info" });
      return;
    }

    mutation.mutate(
      { id: selectedId, data: updates },
      {
        onSuccess: () => toast.success("Format updated successfully!"),
        onError: (err) =>
          toast.error(err.response?.data?.message || "Failed to update"),
      }
    );
  };

  if (loadingList) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Select Format Card */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Select Format to Update
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
          {matchTypes.map((type) => (
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
                name="format"
                value={type._id}
                checked={selectedId === type._id}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-gray-800">
                {type.name} ({type.total_overs || "?"} overs)
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Edit Form */}
      {selectedId && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Format Details</h2>

          {loadingOne ? (
            <div className="text-center py-8"><Loading /></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Format Name
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
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Total Overs
                    </label>
                    <input
                      name="total_overs"
                      type="number"
                      value={formData.total_overs}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Balls Per Over
                    </label>
                    <input
                      name="balls_per_over"
                      type="number"
                      value={formData.balls_per_over}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Powerplay Overs
                    </label>
                    <input
                      name="power_play_overs"
                      type="number"
                      value={formData.power_play_overs}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                 </div>
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? "Updating..." : "Update Format"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default UpdateMatchType;
