import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getPlayers } from "./../api/api";
import { Link } from "react-router-dom";
import Loading from "./../components/Loading";

const Players = () => {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["players"],
    queryFn: getPlayers,
  });

  const players = response?.data ?? [];

  const formatDOB = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="py-12 bg-gray-50">
      <h2
        className="
        text-3xl sm:text-4xl font-extrabold
        bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700
        bg-clip-text text-transparent
        mb-8 tracking-tight
        max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
        drop-shadow-sm
      "
      >
        Players
      </h2>

      {isLoading && <Loading />}

      {isError && (
        <p className="text-center text-red-600">
          {error?.response?.data?.message || "Failed to load players"}
        </p>
      )}

      {!isLoading && !isError && players.length === 0 && (
        <p className="text-center text-gray-500">No players found.</p>
      )}

      {!isLoading && !isError && players.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto hide-scrollbar">
            <div className="flex gap-6 py-4 snap-x snap-mandatory">
              {players.map((player) => (
                <Link
                  key={player._id}
                  to={`/players/${player._id}`}
                  className="
                    flex-none w-64 sm:w-72 md:w-80
                    bg-white rounded-xl shadow-md overflow-hidden
                    hover:shadow-xl transition-shadow
                    snap-center
                  "
                >
                  <img
                    src={player.image}
                    alt={player.name}
                    className="w-full h-56 object-cover rounded-t-xl"
                    loading="lazy"
                  />
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">
                      {player.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      DOB: {formatDOB(player.date_of_birth)}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Gender: {player.gender === "M" ? "Male" : "Female"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Players;
