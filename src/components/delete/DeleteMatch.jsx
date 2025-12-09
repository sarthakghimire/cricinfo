import { useState } from "react";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useMatches } from "../../hooks/matches/useMatches";
import { useDeleteMatch } from "../../hooks/matches/useDeleteMatch";

const DeleteMatch = () => {
  const [search, setSearch] = useState("");
  const { data: res, isLoading } = useMatches();
  const matches = res?.data || [];

  const filtered = matches.filter(
    (m) =>
      m.team_1.name.toLowerCase().includes(search.toLowerCase()) ||
      m.team_2.name.toLowerCase().includes(search.toLowerCase())
  );

  const mutation = useDeleteMatch();

  const handleDelete = (id, name1, name2) => {
    if (window.confirm(`Delete match: ${name1} vs ${name2}?`)) {
      mutation.mutate(id);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold text-center text-red-700">
        Delete Match
      </h2>

      <input
        type="text"
        placeholder="Search teams..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-red-500"
      />

      <div className="space-y-3">
        {filtered.map((m) => (
          <div
            key={m._id}
            className="flex justify-between items-center bg-white p-5 rounded-lg shadow hover:shadow-md transition"
          >
            <div>
              <p className="font-bold text-lg">
                {m.team_1.name} vs {m.team_2.name}
              </p>
              <p className="text-sm text-gray-600">
                {m.stage.name} • Match {m.match_number}
              </p>
            </div>
            <button
              onClick={() => handleDelete(m._id, m.team_1.name, m.team_2.name)}
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

export default DeleteMatch;
