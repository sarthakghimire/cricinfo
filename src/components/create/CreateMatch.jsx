import { useState } from "react";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useTournaments } from "../../hooks/tournaments/useTournaments";
import { useStagesByTournament } from "../../hooks/matches/useStagesByTournament";
import { useTeams } from "../../hooks/teams/useTeams";
import { useVenues } from "../../hooks/venues/useVenues";
import { useCreateMatch } from "../../hooks/matches/useCreateMatch";

const CreateMatch = () => {
  const [formData, setFormData] = useState({
    team_1: "",
    team_2: "",
    tournament: "",
    stage: "",
    venue: "",
    date: "",
    match_number: "",
    description: "",
  });

  const { data: tournamentsRes, isLoading: tLoading } = useTournaments();
  const { data: teamsRes, isLoading: teamLoading } = useTeams();
  const { data: venuesRes, isLoading: vLoading } = useVenues();
  const { data: stagesRes, isLoading: sLoading } = useStagesByTournament(
    formData.tournament
  );

  const tournaments = tournamentsRes?.data || [];
  const teams = teamsRes?.data || [];
  const venues = venuesRes?.data || [];
  const stages = stagesRes?.data || [];

  const mutation = useCreateMatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.team_1 === formData.team_2) {
      toast.error("Both teams cannot be the same");
      return;
    }

    const payload = {
      team_1: formData.team_1,
      team_2: formData.team_2,
      tournament: formData.tournament,
      stage: formData.stage,
      venue: formData.venue,
      date: new Date(formData.date).toISOString(),
      match_number: Number(formData.match_number),
      description: formData.description.trim() || undefined,
    };

    mutation.mutate(payload);
  };

  if (tLoading || teamLoading || vLoading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Create New Match
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Teams */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Team 1</label>
            <select
              name="team_1"
              value={formData.team_1}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tournament
            </label>
            <select
              name="tournament"
              value={formData.tournament}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">Stage</label>
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
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">Venue</label>
            <select
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Match Number
          </label>
          <input
            name="match_number"
            type="number"
            placeholder="Match Number (e.g. 1)"
            value={formData.match_number}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
           <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Match description (optional)"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition transform hover:scale-105 disabled:scale-100"
        >
          {mutation.isPending ? "Creating Match..." : "Create Match"}
        </button>
      </form>
    </div>
  );
};

export default CreateMatch;
