import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useMatchTypes } from "./../../hooks/matchTypes/useMatchTypes";
import { useDeleteMatchType } from "../../hooks/matchTypes/useDeleteMatchType";

const DeleteFormat = () => {
  const { data: response, isLoading, isError, error } = useMatchTypes();

  const mutation = useDeleteMatchType();

  const formats = response?.data || [];

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this format?")) {
      mutation.mutate(id, {
        onSuccess: () => {
          toast.success("Format Deleted Successfully");
        },
        onError: () => {
          toast.error("Error Deleting Format");
        },
      });
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-600">Error: {error.message}</p>;
  if (formats.length === 0)
    return <p className="text-gray-500 text-center py-8">No formats found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Delete Format</h2>
        
        <div className="space-y-4">
          {formats.map((format) => (
            <div
              key={format._id}
              className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-lg hover:shadow-md transition"
            >
              <div>
                <p className="font-semibold text-lg text-gray-800">{format.name}</p>
                {format.description && (
                  <p className="text-gray-500 text-sm mt-1">{format.description}</p>
                )}
                <div className="flex gap-4 mt-2 text-xs text-gray-400">
                  {format.overs && <span>Overs: {format.overs}</span>}
                  {format.playersPerTeam && (
                    <span>Players: {format.playersPerTeam}</span>
                  )}
                  {format.ballsPerOver && (
                    <span>Balls/Over: {format.ballsPerOver}</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDelete(format._id)}
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

export default DeleteFormat;
