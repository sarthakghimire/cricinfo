import React from "react";
import { deleteOfficial } from "../../api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useOfficials } from "./../../hooks/officials/useOfficials";

const DeleteOfficial = () => {
  const queryClient = useQueryClient();

  const { data: response, isLoading, isError, error } = useOfficials();

  const mutation = useMutation({
    mutationFn: deleteOfficial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["officials"] });
      toast.success("Official deleted successfully");
    },
    onError: (err) => {
      toast.error("Failed to delete official");
      console.error(err);
    },
  });

  const officials = response?.data || [];

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this official?")) {
      mutation.mutate(id);
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-600">Error: {error.message}</p>;
  if (officials.length === 0)
    return <p className="text-gray-500 text-center py-8">No officials found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Delete Officials</h2>

      {officials.map((official) => (
        <div
          key={official._id}
          className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition"
        >
          <div className="flex items-center gap-4">
            {official.image && (
              <img
                src={official.image}
                alt={official.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <p className="font-semibold text-lg">{official.name}</p>
              {official.role && (
                <p className="text-gray-600 text-sm">{official.role}</p>
              )}
              {official.license && (
                <p className="text-gray-500 text-xs">
                  License: {official.license}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => handleDelete(official._id)}
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

export default DeleteOfficial;
