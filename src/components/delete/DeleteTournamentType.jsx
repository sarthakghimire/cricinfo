import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useTournamentTypes } from "../../hooks/tournaments/useTournamentTypes";
import { useDeleteTournamentType } from "../../hooks/tournaments/useDeleteTournamentType";

const DeleteTournamentType = () => {
  const { data: response, isLoading, isError, error } = useTournamentTypes();

  const mutation = useDeleteTournamentType();

  const tournamentTypes = response?.data || [];

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this tournament type?")) {
      mutation.mutate(id, {
        onSuccess: () => {
          toast.success("Tournament type deleted successfully");
        },
        onError: () => {
          toast.error("Error deleting tournament type");
        },
      });
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-600">Error: {error.message}</p>;
  if (tournamentTypes.length === 0)
    return (
      <p className="text-gray-500 text-center py-8">No tournament types found</p>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Delete Tournament Type
        </h2>

        <div className="space-y-4">
          {tournamentTypes.map((type) => (
            <div
              key={type._id}
              className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-lg hover:shadow-md transition"
            >
              <div>
                <p className="font-semibold text-lg text-gray-800">{type.name}</p>
                {type.description && (
                  <p className="text-gray-500 text-sm mt-1">{type.description}</p>
                )}
              </div>

              <button
                onClick={() => handleDelete(type._id)}
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

export default DeleteTournamentType;
