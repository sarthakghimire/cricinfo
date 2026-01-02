import { useState } from "react";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useMatches } from "../../hooks/matches/useMatches";
import { useTeams } from "../../hooks/teams/useTeams";
import { useInningsByMatch } from "../../hooks/innings/useInningsByMatch";
import { useCreateInning } from "../../hooks/innings/useCreateInning";
import { useUpdateInning } from "../../hooks/innings/useUpdateInning";
import { useDeleteInning } from "../../hooks/innings/useDeleteInning";

const ManageInnings = () => {
  const [selectedMatchId, setSelectedMatchId] = useState("");
  const [formData, setFormData] = useState({
    match: "",
    batting_team: "",
    inning_number: "1",
  });
  const [updateData, setUpdateData] = useState({
    id: "",
    total_runs: "",
    wickets: "",
    overs: "",
  });

  const { data: matchesRes, isLoading: loadingMatches } = useMatches(1, 100);
  const { data: teamsRes } = useTeams();
  const { data: inningsRes, isLoading: loadingInnings } = useInningsByMatch(selectedMatchId);

  const matches = matchesRes?.data || [];
  const teams = teamsRes?.data || [];
  const innings = inningsRes?.data || [];

  const createMutation = useCreateInning();
  const updateMutation = useUpdateInning();
  const deleteMutation = useDeleteInning();

  const handleCreate = (e) => {
    e.preventDefault();
    createMutation.mutate(
      {
        match: formData.match,
        batting_team: formData.batting_team,
        inning_number: Number(formData.inning_number),
      },
      {
        onSuccess: () => {
          toast.success("Innings created successfully!");
          setFormData({ match: "", batting_team: "", inning_number: "1" });
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to create innings");
        },
      }
    );
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updates = {};
    if (updateData.total_runs) updates.total_runs = Number(updateData.total_runs);
    if (updateData.wickets) updates.wickets = Number(updateData.wickets);
    if (updateData.overs) updates.overs = Number(updateData.overs);

    updateMutation.mutate(
      { id: updateData.id, data: updates },
      {
        onSuccess: () => {
          toast.success("Innings updated successfully!");
          setUpdateData({ id: "", total_runs: "", wickets: "", overs: "" });
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to update innings");
        },
      }
    );
  };

  const handleComplete = (id) => {
    if (window.confirm("Mark this innings as completed?")) {
      updateMutation.mutate(
        { id, data: { is_completed: true } },
        {
          onSuccess: () => toast.success("Innings completed!"),
          onError: () => toast.error("Failed to complete innings"),
        }
      );
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this innings? This cannot be undone.")) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success("Innings deleted"),
        onError: () => toast.error("Failed to delete innings"),
      });
    }
  };

  if (loadingMatches) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Create Innings */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Innings</h2>
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Match
              </label>
              <select
                value={formData.match}
                onChange={(e) => setFormData({ ...formData, match: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Match</option>
                {matches.map((match) => (
                  <option key={match._id} value={match._id}>
                    {match.team_a?.name} vs {match.team_b?.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Batting Team
              </label>
              <select
                value={formData.batting_team}
                onChange={(e) => setFormData({ ...formData, batting_team: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Team</option>
                {teams.map((team) => (
                  <option key={team._id} value={team._id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Innings Number
              </label>
              <select
                value={formData.inning_number}
                onChange={(e) => setFormData({ ...formData, inning_number: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">1st Innings</option>
                <option value="2">2nd Innings</option>
                <option value="3">3rd Innings</option>
                <option value="4">4th Innings</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition transform hover:scale-105 disabled:scale-100"
          >
            {createMutation.isPending ? "Creating..." : "Create Innings"}
          </button>
        </form>
      </div>

      {/* View Innings */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">View Innings</h2>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Match
          </label>
          <select
            value={selectedMatchId}
            onChange={(e) => setSelectedMatchId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Match</option>
            {matches.map((match) => (
              <option key={match._id} value={match._id}>
                {match.team_a?.name} vs {match.team_b?.name}
              </option>
            ))}
          </select>
        </div>

        {selectedMatchId && (
          <div className="space-y-4">
            {loadingInnings ? (
              <Loading />
            ) : innings.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No innings found for this match</p>
            ) : (
              innings.map((inning) => (
                <div
                  key={inning._id}
                  className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-lg hover:shadow-md transition"
                >
                  <div>
                    <p className="font-semibold text-lg text-gray-800">
                      {inning.batting_team?.name} - Innings {inning.inning_number}
                    </p>
                    <p className="text-gray-600 text-sm mt-1">
                      {inning.total_runs || 0}/{inning.wickets || 0} in {inning.overs || 0} overs
                      {inning.is_completed && (
                        <span className="ml-2 text-green-600 font-semibold">(Completed)</span>
                      )}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setUpdateData({
                          id: inning._id,
                          total_runs: inning.total_runs || "",
                          wickets: inning.wickets || "",
                          overs: inning.overs || "",
                        })
                      }
                      className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-4 py-2 rounded-lg transition"
                    >
                      Update
                    </button>
                    {!inning.is_completed && (
                      <button
                        onClick={() => handleComplete(inning._id)}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg transition"
                      >
                        Complete
                      </button>
                    )}
                    {!inning.is_completed && (
                      <button
                        onClick={() => handleDelete(inning._id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Update Score */}
      {updateData.id && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Score</h2>
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Total Runs
                </label>
                <input
                  type="number"
                  value={updateData.total_runs}
                  onChange={(e) => setUpdateData({ ...updateData, total_runs: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Wickets
                </label>
                <input
                  type="number"
                  value={updateData.wickets}
                  onChange={(e) => setUpdateData({ ...updateData, wickets: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="10"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Overs
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={updateData.overs}
                  onChange={(e) => setUpdateData({ ...updateData, overs: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 rounded-lg transition"
              >
                {updateMutation.isPending ? "Updating..." : "Update Score"}
              </button>
              <button
                type="button"
                onClick={() => setUpdateData({ id: "", total_runs: "", wickets: "", overs: "" })}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageInnings;
