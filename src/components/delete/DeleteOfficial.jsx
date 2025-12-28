import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useOfficials } from "./../../hooks/officials/useOfficials";
import { useDeleteOfficial } from "../../hooks/officials/useDeleteOfficial";

const DeleteOfficial = () => {
  const { data: response, isLoading, isError, error } = useOfficials();

  const mutation = useDeleteOfficial();

  const officials = response?.data || [];

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this official?")) {
      mutation.mutate(id, {
        onSuccess: () => {
          toast.success("Official Deleted Successfully.");
        },
        onError: () => {
          toast.error("Failed to Deleted Official.");
        },
      });
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-600">Error: {error.message}</p>;
  if (officials.length === 0)
    return <p className="text-gray-500 text-center py-8">No officials found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Delete Official</h2>
        
        <div className="space-y-4">
          {officials.map((official) => (
            <div
              key={official._id}
              className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-lg hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                {official.image && (
                  <img
                    src={official.image}
                    alt={official.name}
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                )}
                <div>
                  <p className="font-semibold text-lg text-gray-800">{official.name}</p>
                  {official.type && (
                    <p className="text-gray-500 text-sm capitalize">{official.type.replace(/_/g, ' ')}</p>
                  )}
                  {official.description && (
                    <p className="text-gray-400 text-xs">
                      {official.description}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDelete(official._id)}
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

export default DeleteOfficial;
