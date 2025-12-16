import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useVenues } from "../../hooks/venues/useVenues";
import { useDeleteVenue } from "../../hooks/venues/useDeleteVenue";

const DeleteVenue = () => {
  const { data: response, isLoading, isError, error } = useVenues();

  const mutation = useDeleteVenue();

  const venues = response?.data || [];

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this venue?")) {
      mutation.mutate(id, {
        onSuccess: () => {
          toast.success("Venue Deleted Successfully");
        },
        onError: () => {
          toast.error("Error Deleting the Venue");
        },
      });
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-600">Error: {error.message}</p>;
  if (venues.length === 0)
    return <p className="text-gray-500">No venues found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Delete Venue</h2>
        
        <div className="space-y-4">
          {venues.map((venue) => (
            <div
              key={venue._id}
              className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-lg hover:shadow-md transition"
            >
              <div>
                <p className="font-semibold text-lg text-gray-800">{venue.name}</p>
                {venue.address && (
                  <p className="text-gray-500 text-sm">{venue.address}</p>
                )}
              </div>

              <button
                onClick={() => handleDelete(venue._id)}
                disabled={mutation.isPending}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold px-5 py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeleteVenue;
