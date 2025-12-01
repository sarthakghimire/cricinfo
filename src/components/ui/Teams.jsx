import React from "react";
import { Link } from "react-router-dom";
import Loading from "../animation/Loading";
import { useTeams } from "../../hooks/teams/useTeams";

const Teams = () => {
  const { data: response, isLoading, isError, error } = useTeams();

  const teams = response?.data ?? [];

  return (
    <section className="py-12 bg-gray-50">
      <h2
        className="
        text-3xl sm:text-4xl font-extrabold
        bg-linear-to-r from-blue-600 via-blue-700 to-indigo-700
        bg-clip-text text-transparent
        mb-8 tracking-tight
        max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
        drop-shadow-sm cursor-pointer
      "
      >
        Teams
      </h2>

      {isLoading && <Loading />}

      {isError && (
        <p className="text-center text-red-600">
          {error?.response?.data?.message || "Failed to load teams"}
        </p>
      )}

      {!isLoading && !isError && teams.length === 0 && (
        <p className="text-center text-gray-500">No teams found.</p>
      )}

      {!isLoading && !isError && teams.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-6 py-4 snap-x snap-mandatory">
              {teams.map((team) => (
                <Link
                  to={`/teams/${team._id}`}
                  key={team._id}
                  className="
                    flex-none w-64 sm:w-72 md:w-80
                    bg-white rounded-xl shadow-md overflow-hidden
                    hover:shadow-xl transition-shadow
                    snap-center flex flex-col items-center p-6
                  "
                >
                  <img
                    src={team.logo}
                    alt={`${team.name} logo`}
                    className="w-24 h-24 object-contain mb-4 rounded-full bg-gray-100 p-2 shadow-sm"
                    loading="lazy"
                  />
                  <h3 className="font-bold text-xl text-gray-900 text-center truncate w-full">
                    {team.name}
                  </h3>
                  <p className="text-sm text-blue-600 italic mt-2 text-center line-clamp-2">
                    "{team.slogan}"
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Teams;
