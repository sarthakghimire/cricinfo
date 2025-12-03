import { useState } from "react";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useTournaments } from "../../hooks/tournaments/useTournaments";
import { useCreateStage } from "../../hooks/stages/useCreateStage";

const CreateStage = () => {
  const [selectedTournamentId, setSelectedTournamentId] = useState("");
  const [stageName, setStageName] = useState("");

  // Fetch all tournaments
  const { data: response, isLoading: loadingTournaments } = useTournaments();
  const tournaments = response?.data || [];

  const mutation = useCreateStage();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedTournamentId) {
      toast.error("Please select a tournament");
      return;
    }
    if (!stageName.trim()) {
      toast.error("Stage name is required");
      return;
    }

    mutation.mutate(
      {
        name: stageName.trim(),
        tournament: selectedTournamentId,
      },
      {
        onSuccess: () => {
          toast.success(`"${stageName}" created successfully!`);
          setStageName("");
          setSelectedTournamentId("");
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to create stage"
          );
        },
      }
    );
  };

  if (loadingTournaments) return <Loading />;

  const selectedTournament = tournaments.find(
    (t) => t._id === selectedTournamentId
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10 p-6">
      {/* Tournament Selection */}
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Select Tournament
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
          {tournaments.map((t) => (
            <label
              key={t._id}
              className={`flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer transition-all
                ${
                  selectedTournamentId === t._id
                    ? "border-blue-600 bg-blue-50 shadow-md"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                }`}
            >
              <input
                type="radio"
                name="tournament"
                value={t._id}
                checked={selectedTournamentId === t._id}
                onChange={(e) => setSelectedTournamentId(e.target.value)}
                className="w-5 h-5 text-blue-600"
              />
              <div>
                <div className="font-semibold text-gray-800">{t.name}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/*Form */}
      {selectedTournamentId && (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Create Stage
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            For:{" "}
            <span className="font-semibold text-blue-600">
              {selectedTournament?.name}
            </span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1">
                Stage Name
              </label>
              <input
                type="text"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                placeholder="e.g. Group Stage, Quarter Final, Final"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition"
            >
              {mutation.isPending ? "Creating..." : "Create Stage"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateStage;
