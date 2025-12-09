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
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h2 className="text-4xl font-extrabold text-center bg-linear-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
        Update Match
      </h2>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-xl font-semibold mb-6">Select Match</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {matches.map((m) => (
            <label
              key={m._id}
              className={`p-5 rounded-xl border-2 cursor-pointer transition
                ${
                  selectedMatchId === m._id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }
              `}
            >
              <input
                type="radio"
                name="match"
                value={m._id}
                checked={selectedMatchId === m._id}
                onChange={(e) => setSelectedMatchId(e.target.value)}
                className="w-5 h-5 text-blue-600"
              />
              <div className="mt-3">
                <p className="font-bold">
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

      {selectedMatchId && selectedMatch && (
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <h3 className="text-3xl font-bold text-center mb-10">
            Editing Match {selectedMatch.match_number}
          </h3>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-xl p-10 space-y-8"
          >
            {/* Teams */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-semibold mb-3">
                  Team 1
                </label>
                <select
                  name="team_1"
                  value={formData.team_1}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 rounded-xl"
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
                <label className="block text-lg font-semibold mb-3">
                  Team 2
                </label>
                <select
                  name="team_2"
                  value={formData.team_2}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 rounded-xl"
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

            {/* Tournament & Stage */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-semibold mb-3">
                  Tournament
                </label>
                <select
                  name="tournament"
                  value={formData.tournament}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 rounded-xl"
                >
                  <option value="">-- Select Tournament --</option>
                  {tournaments.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name} ({t.season})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold mb-3">
                  Stage
                </label>
                {sLoading ? (
                  <p className="text-gray-500">Loading stages...</p>
                ) : stages.length === 0 ? (
                  <p className="text-red-500">No stages in this tournament</p>
                ) : (
                  <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange}
                    required
                    className="w-full px-5 py-4 border-2 rounded-xl"
                  >
                    <option value="">-- Select Stage --</option>
                    {stages.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Venue & Date */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-semibold mb-3">
                  Venue
                </label>
                <select
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 rounded-xl"
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
                <label className="block text-lg font-semibold mb-3">
                  Match Date & Time
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-5 py-4 border-2 rounded-xl"
                />
              </div>
            </div>

            <input
              name="match_number"
              type="number"
              placeholder="Match Number (e.g. 1)"
              value={formData.match_number}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 border-2 rounded-xl"
            />

            <textarea
              name="description"
              placeholder="Match description (optional)"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-5 py-4 border-2 rounded-xl"
            />

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-linear-to-r from-green-600 to-emerald-700 text-white font-bold py-6 rounded-2xl text-2xl hover:from-green-700 hover:to-emerald-800 transition shadow-lg"
            >
              {mutation.isPending ? "Updating Match..." : "Update Match"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateMatch;
