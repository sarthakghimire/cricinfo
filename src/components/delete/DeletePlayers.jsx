import React from "react";
import { deletePlayer, getPlayers } from "./../../api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";

const DeletePlayers = () => {
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  const mutation = useMutation({
    mutationFn: deletePlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["players"] });
      toast.success("Player deleted successfully");
    },
    onError: (err) => {
      toast.error("Failed to delete player");
      console.error(err);
    },
  });

  const players = response?.data || [];

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this player?")) {
      mutation.mutate(id);
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-600">Error: {error.message}</p>;
  if (players.length === 0)
    return <p className="text-gray-500 text-center py-8">No players found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Delete Players</h2>

      {players.map((player) => (
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
            <div>
              <p className="font-semibold text-lg">{player.name}</p>
              {player.position && (
                <p className="text-gray-600 text-sm">{player.position}</p>
              )}
              {player.team && (
                <p className="text-gray-500 text-xs">Team: {player.team}</p>
              )}
            </div>
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
  );
};

export default DeletePlayers;
