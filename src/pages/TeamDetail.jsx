import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { getTeamById } from "./../api/api";
import Header from "./../components/Header";

const TeamDetail = () => {
  const { id } = useParams();
  const {
    data: team,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["team", id],
    queryFn: () => getTeamById(id),
  });

  if (isLoading) return <p className="text-center py-20">Loading team...</p>;
  if (isError)
    return <p className="text-center text-red-600 py-20">{error?.message}</p>;
  if (!team) return <p className="text-center py-20">Team not found.</p>;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="text-blue-600 hover:underline text-sm mb-6 inline-block"
          >
            &larr; Back to Home
          </Link>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img
              src={team.banner_image}
              alt={team.name}
              className="w-full h-80 object-cover"
            />
            <div className="p-8">
              <div className="flex items-center gap-6 mb-6">
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-24 h-24 rounded-full shadow-md"
                />
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    {team.name}
                  </h1>
                  <p className="text-xl text-blue-600 italic">
                    "{team.slogan}"
                  </p>
                </div>
              </div>

              <div className="prose max-w-none text-gray-700 mb-8">
                <p>{team.description}</p>
              </div>

              <div className="text-sm text-gray-500">
                <p>Added: {new Date(team.created_at).toLocaleDateString()}</p>
                <p>Updated: {new Date(team.updated_at).toLocaleDateString()}</p>
              </div>

              {team.players && team.players.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-3">
                    Players ({team.players.length})
                  </h3>
                  <p className="text-sm text-gray-600">
                    Player details coming soon...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeamDetail;
