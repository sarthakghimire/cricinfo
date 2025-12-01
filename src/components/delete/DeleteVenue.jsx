import React from "react";
import { deleteVenue } from "../../api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useVenues } from "../../hooks/venues/useVenues";

const DeleteVenue = () => {
  const queryClient = useQueryClient();

  const { data: response, isLoading, isError, error } = useVenues();

  const mutation = useMutation({
    mutationFn: deleteVenue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
      toast.success("Venue deleted successfully");
    },
    onError: (err) => {
      toast.error("Delete failed");
      console.error(err);
    },
  });

  const venues = response?.data || [];

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this venue?")) {
      mutation.mutate(id);
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-600">Error: {error.message}</p>;
  if (venues.length === 0)
    return <p className="text-gray-500">No venues found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-6">Delete Venues</h2>
      {venues.map((venue) => (
        <div
          key={venue._id}
          className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition"
        >
          <div>
            <p className="font-semibold text-lg">{venue.name}</p>
            {venue.address && (
              <p className="text-gray-600 text-sm">{venue.address}</p>
            )}
          </div>

          <button
            onClick={() => handleDelete(venue._id)}
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
