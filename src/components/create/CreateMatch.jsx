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
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-4xl font-extrabold text-center text-green-700 mb-12">
        Create New Match
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-10 space-y-8"
      >
        {/* Teams */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-lg font-semibold mb-3">Team 1</label>
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
            <label className="block text-lg font-semibold mb-3">Team 2</label>
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
            <label className="block text-lg font-semibold mb-3">Stage</label>
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
            <label className="block text-lg font-semibold mb-3">Venue</label>
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
          {mutation.isPending ? "Creating Match..." : "Create Match"}
        </button>
      </form>
    </div>
  );
};

export default CreateMatch;
