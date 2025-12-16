import { useState, useEffect } from "react";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useTournaments } from "../../hooks/tournaments/useTournaments";
import { useStagesByTournament } from "../../hooks/matches/useStagesByTournament";
import { useUpdateStage } from "../../hooks/stages/useUpdateStage";

const UpdateStage = () => {
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
  const [selectedStageId, setSelectedStageId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
  });

  // Fetch all tournaments
  const { data: tournamentsRes, isLoading: loadingTournaments } =
    useTournaments();
  const tournaments = tournamentsRes?.data || [];

  // Fetch selected tournament
  const {
    data: stagesRes,
    isLoading: loadingStages,
    refetch,
  } = useStagesByTournament(selectedTournamentId);

  const stages = stagesRes?.data || [];

  // Find selected stage data
  const selectedStage = stages.find((s) => s._id === selectedStageId);

  // Auto-fill form when stage changes
  useEffect(() => {
    if (selectedStage) {
      setFormData({
        name: selectedStage.name || "",
      });
    } else if (selectedStageId) {
      setFormData({ name: "" });
    }
  }, [selectedStage, selectedStageId]);

  const handleChange = (e) => {
    const { value } = e.target;
    setFormData({ name: value });
  };

  const mutation = useUpdateStage();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.name.trim() === selectedStage?.name) {
      toast("No changes detected", { icon: "Info" });
      return;
    }

    mutation.mutate(
      {
        stageId: selectedStageId,
        data: { name: formData.name.trim() },
      },
      {
        onSuccess: () => {
          toast.success("Stage updated successfully!");
          refetch(); // refresh list
        },
        onError: (err) =>
          toast.error(err.response?.data?.message || "Failed to update stage"),
      }
    );
  };

  if (loadingTournaments) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Select Tournament */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Select Tournament</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
          {tournaments.map((t) => (
            <label
              key={t._id}
              className={`flex items-center space-x-3 cursor-pointer p-4 rounded-lg border transition-all ${
                selectedTournamentId === t._id
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                  : "border-gray-200 hover:bg-gray-50 hover:border-blue-400"
              }`}
            >
              <input
                type="radio"
                name="tournament"
                value={t._id}
                checked={selectedTournamentId === t._id}
                onChange={(e) => {
                  setSelectedTournamentId(e.target.value);
                  setSelectedStageId("");
                }}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-gray-800">
                {t.name} ({t.season})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Select Stage */}
      {selectedTournamentId && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          {loadingStages ? (
            <div className="text-center py-8">
              <Loading />
            </div>
          ) : stages.length === 0 ? (
            <p className="text-center text-gray-500 py-4">
              No stages found in this tournament.
            </p>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Select Stage to Update
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stages.map((stage) => (
                  <label
                    key={stage._id}
                    className={`flex items-center space-x-3 cursor-pointer p-4 rounded-lg border transition-all ${
                      selectedStageId === stage._id
                        ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                        : "border-gray-200 hover:bg-gray-50 hover:border-blue-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="stage"
                      value={stage._id}
                      checked={selectedStageId === stage._id}
                      onChange={(e) => setSelectedStageId(e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-800">{stage.name}</span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Edit Form */}
      {selectedStageId && selectedStage && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Stage Details</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stage Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Group Stage, Final"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? "Updating..." : "Update Stage"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateStage;
