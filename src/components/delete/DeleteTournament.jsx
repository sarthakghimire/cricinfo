import { useState } from "react";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useTournaments } from "../../hooks/tournaments/useTournaments";
import { useDeleteTournament } from "../../hooks/tournaments/useDeleteTournament";

const DeleteTournament = () => {
  const [search, setSearch] = useState("");
  const { data: res, isLoading } = useTournaments();
  const tournaments = res?.data || [];

  const filtered = tournaments.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const mutation = useDeleteTournament();

  const handleDelete = (id, name) => {
    if (
      window.confirm(`Delete "${name}" permanently? This cannot be undone!`)
    ) {
      mutation.mutate(id, {
        onSuccess: () => toast.success(`"${name}" deleted`),
        onError: () => toast.error("Failed to delete tournament"),
      });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Delete Tournament</h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search tournament..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          {filtered.map((t) => (
            <div
              key={t._id}
              className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-lg hover:shadow-md transition"
            >
              <div>
                <p className="font-semibold text-lg text-gray-800">{t.name}</p>
                <p className="text-sm text-gray-500">
                  {t.season} • {t.total_overs || "?"} overs
                </p>
              </div>
              <button
                onClick={() => handleDelete(t._id, t.name)}
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

export default DeleteTournament;
