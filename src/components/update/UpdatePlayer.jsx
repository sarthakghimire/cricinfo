import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlayers, getPlayerById, updatePlayer } from "../../api/api";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";

const UpdatePlayer = () => {
  const queryClient = useQueryClient();
  const [selectedPlayerId, setSelectedPlayerId] = useState("");

  //all players
  const { data: playersResponse, isLoading: loadingPlayers } = useQuery({
    queryKey: ["players"],
    queryFn: () => getPlayers(1, 100),
  });

  const players = playersResponse?.data || [];

  //selected player from radio
  const { data: player, isLoading: loadingPlayer } = useQuery({
    queryKey: ["player", selectedPlayerId],
    queryFn: () => getPlayerById(selectedPlayerId),
    enabled: !!selectedPlayerId,
    retry: false,
  });

  //mutate
  const mutation = useMutation({
    mutationFn: (updates) => updatePlayer(selectedPlayerId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      queryClient.invalidateQueries({ queryKey: ["player", selectedPlayerId] });
      toast.success("Player updated!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = Object.fromEntries(formData);
    Object.keys(updates).forEach((key) => !updates[key] && delete updates[key]);
    if (Object.keys(updates).length === 0) return toast("No changes");
    mutation.mutate(updates);
  };

  if (loadingPlayers) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h2 className="text-4xl font-extrabold text-center bg-linear-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
        Update Player
      </h2>

      {/* Responsive Player Grid */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Select Player to Edit
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
          {players.map((p) => (
            <label
              key={p._id}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition"
            >
              <input
                type="radio"
                name="player"
                value={p._id}
                checked={selectedPlayerId === p._id}
                onChange={(e) => setSelectedPlayerId(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-800 font-medium truncate">
                {p.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Edit Form */}
      {selectedPlayerId && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          {loadingPlayer ? (
            <div className="text-center py-12">
              <Loading />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h3 className="text-2xl font-bold text-center text-gray-800">
                Editing: <span className="text-blue-600">{player?.name}</span>
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <input
                  name="name"
                  type="text"
                  defaultValue={player?.name}
                  placeholder="Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="image"
                  type="text"
                  defaultValue={player?.image}
                  placeholder="Image URL"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="date_of_birth"
                  type="date"
                  defaultValue={player?.date_of_birth?.slice(0, 10)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                />
                <select
                  name="gender"
                  defaultValue={player?.gender || "M"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-linear-to-r from-blue-600 to-indigo-700 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? "Saving..." : "Update Player"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default UpdatePlayer;
