import React from "react";
import { Link, useParams } from "react-router-dom";
import { getMatches } from "../api/api";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";

const Matches = () => {
  const {
    data: response,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["match"],
    queryFn: getMatches,
  });

  const matches = response?.data || [];

  if (isLoading || !response) return <Loading />;
  if (isError) return <p className="text-red-600">Error:{error}</p>;
  if (matches.length == 0)
    return <p className="text-red-500">No matches found</p>;

  return (
    <div className="h-screen">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => {
          //Change
          if (!match.team_1 || !match.team_2) {
            return (
              <div key={match._id} className="text-center p-10 text-red-600">
                Invalid match data
              </div>
            );
          }
          return (
            <Link
              key={match._id}
              to={`/matches/${match._id}`}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 hover:shadow-3xl hover:scale-105 transition-all duration-500 group m-6 flex flex-col justify-between"
            >
              <div className="flex items-center justify-center gap-8 p-10 bg-gradient-to-b from-blue-50 to-indigo-50 flex-1">
                <div className="text-center">
                  <img
                    className="w-28 h-28 rounded-full object-cover border-8 border-white shadow-2xl  transition-all duration-300 mx-auto"
                    src={match.team_1.logo}
                    alt={match.team_1.name}
                  />
                  <p className="text-2xl font-extrabold text-gray-800 mt-4 group-hover:text-blue-700">
                    {match.team_1.name}
                  </p>
                </div>

                <strong className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
                  VS
                </strong>

                <div className="text-center">
                  <img
                    className="w-28 h-28 rounded-full object-cover border-8 border-white shadow-2xl  transition-all duration-300 mx-auto"
                    src={match.team_2.logo}
                    alt={match.team_2.name}
                  />
                  <p className="text-2xl font-extrabold text-gray-800 mt-4 group-hover:text-indigo-700">
                    {match.team_2.name}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center">
                <p className="text-lg font-semibold">{match.venue.name}</p>
                <p className="text-sm opacity-90 mt-1">
                  {new Date(match.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Matches;
