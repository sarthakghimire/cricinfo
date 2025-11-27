import React from "react";
import { deleteTeam, getTeams } from "../../api/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";

const DeleteVenue = () => {
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });

  const mutation = useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Team deleted successfully");
    },
    onError: (err) => {
      toast.error("Delete failed");
      console.error(err);
    },
  });

  const teams = response?.data || [];

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      mutation.mutate(id);
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-600">Error: {error.message}</p>;
  if (teams.length === 0)
    return <p className="text-gray-500">No teams found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Delete Teams</h2>
      {teams.map((team) => (
        <div
          key={team._id}
          className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition"
        >
          <div>
            <p className="font-semibold text-lg">{team.name}</p>
            {team.address && (
              <p className="text-gray-600 text-sm">{team.address}</p>
            )}
          </div>

          <button
            onClick={() => handleDelete(team._id)}
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

export default DeleteVenue;
