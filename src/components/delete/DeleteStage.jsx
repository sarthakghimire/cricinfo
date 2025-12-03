import { useState } from "react";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useStagesByTournament } from "../../hooks/matches/useStagesByTournament";
import { useDeleteStage } from "../../hooks/stages/useDeleteStage";
import { useTournaments } from "../../hooks/tournaments/useTournaments";

const DeleteStage = () => {
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
  const [search, setSearch] = useState("");

  // Load all tournaments
  const { data: tournamentsRes, isLoading: loadingTournaments } =
    useTournaments();
  const tournaments = tournamentsRes?.data || [];

  // Load stages
  const {
    data: stagesRes,
    isLoading: loadingStages,
    isError,
  } = useStagesByTournament(selectedTournamentId);

  const stages = stagesRes?.data || [];

  // Filter stages
  const filteredStages = stages.filter((stage) =>
    stage.name.toLowerCase().includes(search.toLowerCase())
  );

  const mutation = useDeleteStage();

  const handleDelete = (stageId, stageName) => {
    if (window.confirm(`Delete "${stageName}" permanently?`)) {
      mutation.mutate(stageId, {
        onSuccess: () => toast.success(`"${stageName}" deleted`),
        onError: () => toast.error("Failed to delete stage"),
      });
    }
  };

  if (loadingTournaments) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold text-center text-red-700">
        Delete Stage
      </h2>

      {/* buttons */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Select Tournament
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {tournaments.map((t) => (
            <label
              key={t._id}
              className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition
                ${
                  selectedTournamentId === t._id
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
            >
              <input
                type="radio"
                name="tournament"
                value={t._id}
                checked={selectedTournamentId === t._id}
                onChange={(e) => setSelectedTournamentId(e.target.value)}
                className="w-5 h-5 text-red-600"
              />
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-gray-600">{t.season}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Stages List */}
      {selectedTournamentId && (
        <>
          {loadingStages ? (
            <Loading />
          ) : isError ? (
            <p className="text-red-600 text-center">Error loading stages</p>
          ) : (
            <div className="space-y-6">
              {/* Search */}
              <input
                type="text"
                placeholder="Search stage name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-lg"
              />

              {/* Stages */}
              <div className="space-y-3">
                {filteredStages.length > 0 ? (
                  filteredStages.map((stage) => (
                    <div
                      key={stage._id}
                      className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition"
                    >
                      <p className="font-semibold text-lg">{stage.name}</p>

                      <button
                        onClick={() => handleDelete(stage._id, stage.name)}
                        disabled={mutation.isPending}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg disabled:bg-red-400 transition font-medium"
                      >
                        {mutation.isPending ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    {search
                      ? "No stages match your search"
                      : "No stages in this tournament"}
                  </p>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* No tournament selected */}
      {!selectedTournamentId && (
        <p className="text-center text-gray-500 py-20 text-lg">
          Please select a tournament to view and delete stages
        </p>
      )}
    </div>
  );
};

export default DeleteStage;
