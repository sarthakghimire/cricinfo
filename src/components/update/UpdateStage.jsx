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
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h2 className="text-4xl font-extrabold text-center bg-linear-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
        Update Stage
      </h2>

      {/* Select Tournament */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-semibold mb-6">Select Tournament</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {tournaments.map((t) => (
            <label
              key={t._id}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-4 rounded-lg border transition"
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
                className="w-5 h-5 text-blue-600"
              />
              <span className="font-medium">
                {t.name} ({t.season})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/*  Select Stage */}
      {selectedTournamentId && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          {loadingStages ? (
            <div className="text-center py-12">
              <Loading />
            </div>
          ) : stages.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No stages found in this tournament.
            </p>
          ) : (
            <>
              <h3 className="text-xl font-semibold mb-6">
                Select Stage to Edit
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stages.map((stage) => (
                  <label
                    key={stage._id}
                    className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-4 rounded-lg border transition"
                  >
                    <input
                      type="radio"
                      name="stage"
                      value={stage._id}
                      checked={selectedStageId === stage._id}
                      onChange={(e) => setSelectedStageId(e.target.value)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="font-medium">{stage.name}</span>
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
          <h3 className="text-2xl font-bold text-center mb-8">
            Editing: <span className="text-blue-600">{selectedStage.name}</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            <div>
              <label className="block text-sm font-medium mb-1">
                Stage Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Group Stage, Final"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {mutation.isPending ? "Saving..." : "Update Stage"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateStage;
