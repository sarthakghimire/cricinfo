import React, { useState, useEffect } from "react";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useTeams } from "../../hooks/teams/useTeams";
import { useTeam } from "../../hooks/teams/useTeam";
import { usePlayers } from "../../hooks/players/usePlayers";
import { useUpdateTeam } from "../../hooks/teams/useUpdateTeam";

const UpdateTeam = () => {
  const [selectedTeamId, setSelectedTeamId] = useState("");

  // Fetch all teams for radio selection
  const { data: teamsRes, isLoading: loadingTeams } = useTeams();

  const teams = teamsRes?.data || [];

  // Fetch selected team details
  const { data: team, isLoading: loadingTeam } = useTeam(selectedTeamId);

  // Fetch all players
  const { data: playersRes } = usePlayers(1, 100);

  const allPlayers = playersRes?.data || [];

  // Block players in other teams
  const usedByOtherTeams = new Set();
  teams
    .filter((t) => t._id !== selectedTeamId)
    .forEach((t) =>
      t.players?.forEach((p) => usedByOtherTeams.add(p._id || p))
    );

  const availablePlayers = allPlayers.filter(
    (p) => !usedByOtherTeams.has(p._id)
  );

  const currentTeamPlayers = allPlayers.filter((p) =>
    team?.players?.some((tp) => (tp._id || tp) === p._id)
  );

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slogan: "",
    description: "",
    logo: "",
    banner_image: "",
    players: [],
  });

  // Sync form when team loads
  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name || "",
        slogan: team.slogan || "",
        description: team.description || "",
        logo: team.logo || "",
        banner_image: team.banner_image || "",
        players: team.players?.map((p) => p._id || p) || [],
      });
    }
  }, [team]);

  const mutation = useUpdateTeam();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlayersChange = (e) => {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    setFormData((prev) => ({ ...prev, players: selected }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updates = {};
    const fields = ["name", "slogan", "description", "logo", "banner_image"];
    fields.forEach((field) => {
      if (formData[field] !== (team[field] || "")) {
        updates[field] = formData[field].trim();
      }
    });

    const currentPlayerIds = team.players?.map((p) => p._id || p) || [];
    if (
      JSON.stringify(formData.players.sort()) !==
      JSON.stringify(currentPlayerIds.sort())
    ) {
      updates.players = formData.players;
    }

    if (Object.keys(updates).length === 0) {
      toast("No changes made");
      return;
    }

    mutation.mutate(
      { teamId: selectedTeamId, updates: updates },
      {
        onSuccess: () => {
          toast.success("Team Details Updated.");
        },
        onError: () => {
          toast.error("Error Updating Team");
        },
      }
    );
  };

  if (loadingTeams) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Select Team Card */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Select Team to Update</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
          {teams.map((t) => (
            <label
              key={t._id}
              className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                selectedTeamId === t._id
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="team"
                value={t._id}
                checked={selectedTeamId === t._id}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium text-gray-700">{t.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Update Form Card */}
      {selectedTeamId && team && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Team Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Team Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Team Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Slogan & Description */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Slogan
                </label>
                <input
                  type="text"
                  name="slogan"
                  value={formData.slogan}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Banner Image URL
              </label>
              <input
                type="url"
                name="banner_image"
                value={formData.banner_image}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Players Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Manage Players (Hold Ctrl/Cmd to select multiple)
              </label>
              <select
                multiple
                value={formData.players}
                onChange={handlePlayersChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 h-64 text-sm"
              >
                <optgroup label="Current Team Players">
                  {currentTeamPlayers.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} (Current)
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Available Players">
                  {availablePlayers.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.gender === "M" ? "Male" : "Female"})
                    </option>
                  ))}
                </optgroup>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Selected: <strong>{formData.players.length}</strong> players.
              </p>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? "Updating..." : "Update Team"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateTeam;
