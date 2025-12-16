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
                onChange={(e) => setSelectedTournamentId(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <div className="min-w-0">
                 <p className="font-medium text-gray-800 truncate">{t.name}</p>
                 <p className="text-xs text-gray-500">{t.season}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Stages List */}
      {selectedTournamentId && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Delete Stage</h2>
          
          {loadingStages ? (
            <div className="text-center py-8"><Loading /></div>
          ) : isError ? (
            <p className="text-red-600 text-center">Error loading stages</p>
          ) : (
            <>
               <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search stage name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                   className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

               <div className="space-y-4">
                 {filteredStages.map((stage) => (
                    <div
                      key={stage._id}
                      className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-lg hover:shadow-md transition"
                    >
                      <p className="font-semibold text-lg text-gray-800">{stage.name}</p>
                      
                      <button
                        onClick={() => handleDelete(stage._id, stage.name)}
                        disabled={mutation.isPending}
                        className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold px-5 py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                         {mutation.isPending ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                 ))}
                 {filteredStages.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No stages found</p>
                 )}
               </div>
            </>
          )}
        </div>
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
