import React, { useState } from "react";
import { deletePlayer } from "./../../api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { usePlayers } from "../../hooks/players/usePlayers";

const DeletePlayers = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: response, isLoading, isError, error } = usePlayers(1, 100);

  const mutation = useMutation({
    mutationFn: deletePlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success("Player deleted");
    },
    onError: () => toast.error("Delete failed"),
  });

  const players = response?.data || [];

  const filteredPlayers = players.filter((player) =>
    player.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    if (window.confirm("Delete this player?")) {
      mutation.mutate(id);
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-600">Error loading players</p>;

  return (
    <div className="space-y-6">
      <input
        type="text"
        placeholder="Search player name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 text-lg"
      />
      <div className="space-y-3">
        {filteredPlayers.map((player) => (
          <div
            key={player._id}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              {player.image && (
                <img
                  src={player.image}
                  alt={player.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <p className="font-semibold text-lg">{player.name}</p>
            </div>

            <button
              onClick={() => handleDelete(player._id)}
              disabled={mutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg disabled:bg-red-400 transition"
            >
              {mutation.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>
        ))}
      </div>

      {filteredPlayers.length === 0 && search && (
        <p className="text-center text-gray-500 py-8">No players found</p>
      )}
    </div>
  );
};

export default DeletePlayers;
