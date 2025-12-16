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
    <div className="max-w-4xl mx-auto p-6 mt-8">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Delete Match</h2>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search matches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          {filtered.map((m) => (
            <div
              key={m._id}
              className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-lg hover:shadow-md transition"
            >
              <div>
                <p className="font-bold text-lg text-gray-800">
                  {m.team_1.name} vs {m.team_2.name}
                </p>
                <p className="text-sm text-gray-500">
                  {m.stage.name} • Match {m.match_number}
                </p>
              </div>
              <button
                onClick={() => handleDelete(m._id, m.team_1.name, m.team_2.name)}
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

export default DeleteMatch;
