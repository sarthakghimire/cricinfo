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
      console.log("Auto-filling form with:", matchType); // You see this → now form WILL update
      const playerData = matchType.data;
      console.log(playerData);
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
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h2 className="text-4xl font-extrabold text-center bg-linear-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
        Update Match Format
      </h2>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-semibold mb-6">Select Format</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {matchTypes.map((type) => (
            <label
              key={type._id}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-4 rounded-lg border transition"
            >
              <input
                type="radio"
                name="format"
                value={type._id}
                checked={selectedId === type._id}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-5 h-5 text-blue-600"
              />
              <span className="font-medium">
                {type.name} ({type.total_overs || "?"} overs)
              </span>
            </label>
          ))}
        </div>
      </div>

      {selectedId && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          {loadingOne ? (
            <div className="text-center py-12">
              <Loading />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-2xl font-bold text-center">
                Editing:{" "}
                <span className="text-blue-600">
                  {formData?.name || "Loading..."}
                </span>
              </h3>

              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full p-3 border rounded-lg"
              />
              <input
                name="description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description (optional)"
                className="w-full p-3 border rounded-lg"
              />
              <input
                name="total_overs"
                type="number"
                value={formData.total_overs}
                onChange={handleChange}
                placeholder="Total Overs"
                required
                className="w-full p-3 border rounded-lg"
              />
              <input
                name="balls_per_over"
                type="number"
                value={formData.balls_per_over}
                onChange={handleChange}
                placeholder="Balls per over (default 6)"
                className="w-full p-3 border rounded-lg"
              />
              <input
                name="power_play_overs"
                type="number"
                value={formData.power_play_overs}
                onChange={handleChange}
                placeholder="Powerplay overs (optional)"
                className="w-full p-3 border rounded-lg"
              />

              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                {mutation.isPending ? "Saving..." : "Update Format"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default UpdateMatchType;
