import { useState, useEffect } from "react";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useMatches } from "../../hooks/matches/useMatches";
import { useUpdateMatch } from "../../hooks/matches/useUpdateMatch";
import { useTeams } from "../../hooks/teams/useTeams";
import { useVenues } from "../../hooks/venues/useVenues";

const UpdateMatch = () => {
  const [selectedMatchId, setSelectedMatchId] = useState("");

  const { data: matchesRes, isLoading: loadingMatches } = useMatches();
  const matches = matchesRes?.data || [];

  const { data: teamsRes } = useTeams();
  const { data: venuesRes } = useVenues();
  const teams = teamsRes?.data || [];
  const venues = venuesRes?.data || [];

  const selectedMatch = matches.find((m) => m._id === selectedMatchId);

  const [formData, setFormData] = useState({
    team_1: "",
    team_2: "",
    venue: "",
    date: "",
    match_number: "",
    description: "",
  });

  useEffect(() => {
    if (selectedMatch) {
      setFormData({
        team_1: selectedMatch.team_1?._id || "",
        team_2: selectedMatch.team_2?._id || "",
        venue: selectedMatch.venue?._id || "",
        date: selectedMatch.date
          ? new Date(selectedMatch.date).toISOString().slice(0, 16)
          : "",
        match_number: selectedMatch.match_number || "",
        description: selectedMatch.description || "",
      });
    }
  }, [selectedMatch]);

  const mutation = useUpdateMatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      matchId: selectedMatchId,
      data: formData,
    });
  };

  if (loadingMatches) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Select Match Card */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Select Match to Update</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-h-96 overflow-y-auto pr-2">
          {matches.map((m) => (
            <label
              key={m._id}
              className={`p-5 rounded-lg border cursor-pointer transition-all ${
                selectedMatchId === m._id
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                  : "border-gray-200 hover:bg-gray-50 hover:border-blue-400"
              }`}
            >
              <input
                type="radio"
                name="match"
                value={m._id}
                checked={selectedMatchId === m._id}
                onChange={(e) => setSelectedMatchId(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <div className="mt-3">
                <p className="font-bold text-gray-800">
                  {m.team_1.name} vs {m.team_2.name}
                </p>
                <p className="text-sm text-gray-600">
                  {m.stage.name} • Match {m.match_number}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Update Form Card */}
      {selectedMatchId && selectedMatch && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Match Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Team 1</label>
                <select
                  name="team_1"
                  value={formData.team_1}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Select Team 1 --</option>
                  {teams.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Team 2</label>
                <select
                  name="team_2"
                  value={formData.team_2}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Select Team 2 --</option>
                  {teams.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Venue</label>
                <select
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Select Venue --</option>
                  {venues.map((v) => (
                    <option key={v._id} value={v._id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Match Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Match Number</label>
                <input
                  name="match_number"
                  type="number"
                  value={formData.match_number}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
             </div>

             <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
             </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? "Updating..." : "Update Match"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateMatch;
