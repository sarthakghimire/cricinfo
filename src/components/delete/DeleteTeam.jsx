import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useTeams } from "../../hooks/teams/useTeams";
import { useDeleteTeam } from "./../../hooks/teams/useDeleteTeam";

const DeleteTeam = () => {
  const { data: response, isLoading, isError, error } = useTeams();

  const mutation = useDeleteTeam();

  const teams = response?.data || [];

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      mutation.mutate(id, {
        onSuccess: () => {
          toast.success("Team Deleted Successfully");
        },
        onError: () => {
          toast.error("Failed to Delete Team");
        },
      });
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <p className="text-red-600">Error: {error.message}</p>;
  if (teams.length === 0)
    return <p className="text-gray-500">No teams found</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Delete Team</h2>
        <div className="space-y-4">
          {teams.map((team) => (
            <div
              key={team._id}
              className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-lg hover:shadow-md transition"
            >
              <div>
                <p className="font-semibold text-lg text-gray-800">{team.name}</p>
                {team.address && (
                  <p className="text-gray-500 text-sm">{team.address}</p>
                )}
              </div>

              <button
                onClick={() => handleDelete(team._id)}
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

export default DeleteTeam;
