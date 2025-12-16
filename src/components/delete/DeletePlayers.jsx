import React, { useState } from "react";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { usePlayers } from "../../hooks/players/usePlayers";
import { useDeletePlayer } from "./../../hooks/players/useDeletePlayer";

const DeletePlayers = () => {
  const [search, setSearch] = useState("");

  const { data: response, isLoading, isError, error } = usePlayers(1, 100);

  const mutation = useDeletePlayer();

  const players = response?.data || [];

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("Delete this player?")) {
      mutation.mutate(id, {
        onSuccess: () => {
          toast.success("Player Deleted");
        },
        onError: (error) => {
          toast.error("Failed to Delete Player");
        },
      });
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-600">Error loading players</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Delete Player</h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search player name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          {filteredPlayers.map((player) => (
            <div
              key={player._id}
              className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-lg hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                {player.image && (
                  <img
                    src={player.image}
                    alt={player.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                )}
                <p className="font-semibold text-lg text-gray-800">{player.name}</p>
              </div>

              <button
                onClick={() => handleDelete(player._id)}
                disabled={mutation.isPending}
                 className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold px-5 py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>

        {filteredPlayers.length === 0 && search && (
          <p className="text-center text-gray-500 py-4">No players found</p>
        )}
      </div>
    </div>
  );
};

export default DeletePlayers;
