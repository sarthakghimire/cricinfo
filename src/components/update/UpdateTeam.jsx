import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTeams, getTeamById, updateTeam, getPlayers } from "../../api/api";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";

const UpdateTeam = () => {
  const queryClient = useQueryClient();
  const [selectedTeamId, setSelectedTeamId] = useState("");

  // Fetch all teams for radio selection
  const { data: teamsRes, isLoading: loadingTeams } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });

  const teams = teamsRes?.data || [];

  // Fetch selected team details
  const { data: team, isLoading: loadingTeam } = useQuery({
    queryKey: ["team", selectedTeamId],
    queryFn: () => getTeamById(selectedTeamId),
    enabled: !!selectedTeamId,
    retry: false,
  });

  // Fetch all players
  const { data: playersRes } = useQuery({
    queryKey: ["players"],
    queryFn: () => getPlayers(1, 500),
  });

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
  React.useEffect(() => {
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

  const mutation = useMutation({
    mutationFn: (updates) => updateTeam(selectedTeamId, updates),
    onSuccess: () => {
      toast.success("Team updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team", selectedTeamId] });
    },
  });

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

    mutation.mutate(updates);
  };

  if (loadingTeams) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      <h2 className="text-4xl font-extrabold text-center bg-linear-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
        Update Team
      </h2>

      {/* Team Selection Grid */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">
          Select Team to Edit
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((t) => (
            <label
              key={t._id}
              className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-4 rounded-xl transition border-2 border-gray-200 hover:border-blue-400"
            >
              <input
                type="radio"
                name="team"
                value={t._id}
                checked={selectedTeamId === t._id}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="font-bold text-lg text-gray-800">{t.name}</div>
                {t.slogan && (
                  <div className="text-sm text-gray-600 italic">{t.slogan}</div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {t.players?.length || 0} players
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Edit Form */}
      {selectedTeamId && (
        <div className="bg-white rounded-2xl shadow-xl p-10">
          {loadingTeam ? (
            <div className="text-center py-16">
              <Loading />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <h3 className="text-3xl font-bold text-center text-gray-800">
                Editing: <span className="text-blue-600">{team?.name}</span>
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Team Name"
                  required
                />
                <input
                  name="slogan"
                  type="text"
                  value={formData.slogan}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Slogan"
                />
                <input
                  name="logo"
                  type="url"
                  value={formData.logo}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Logo URL"
                />
                <input
                  name="banner_image"
                  type="url"
                  value={formData.banner_image}
                  onChange={handleChange}
                  className="w-full px-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Banner URL"
                />
              </div>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-5 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Team description..."
              />

              {/* Players Section */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="font-semibold mb-3">
                    Current Players ({currentTeamPlayers.length})
                  </p>
                  <div className="space-y-2 max-h-64 overflow-y-auto bg-gray-50 p-4 rounded-lg">
                    {currentTeamPlayers.map((p) => (
                      <div
                        key={p._id}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            players: prev.players.filter((id) => id !== p._id),
                          }))
                        }
                        className="bg-white px-4 py-2 rounded cursor-pointer hover:bg-red-50 flex justify-between"
                      >
                        <span>{p.name}</span>
                        <span className="text-red-500 text-xs">Remove</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="font-semibold mb-3">
                    Add Players ({availablePlayers.length} available)
                  </p>
                  <select
                    multiple
                    value={formData.players}
                    onChange={handlePlayersChange}
                    className="w-full h-64 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {availablePlayers.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.gender === "M" ? "Male" : "Female"})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-linear-to-r from-blue-600 to-indigo-700 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? "Updating..." : "Update Team"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default UpdateTeam;
