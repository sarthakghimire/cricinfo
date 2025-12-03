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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold text-center text-red-700">
        Delete Tournament
      </h2>

      <input
        type="text"
        placeholder="Search tournament..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-red-500"
      />

      <div className="space-y-3">
        {filtered.map((t) => (
          <div
            key={t._id}
            className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <div>
              <p className="font-semibold text-lg">{t.name}</p>
              <p className="text-sm text-gray-600">
                {t.season} • {t.total_overs} overs
              </p>
            </div>
            <button
              onClick={() => handleDelete(t._id, t.name)}
              disabled={mutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg disabled:opacity-60"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeleteTournament;
