import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getMatchType } from "./../api/api";
import Loading from "./Loading";
import Image from "./../assets/ball.jpg";

const MatchType = () => {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["match"],
    queryFn: getMatchType,
  });
  const matches = response?.data ?? [];
  return (
    <section className="py-12 bg-gray-50">
      <h2
        className="
        text-3xl sm:text-4xl font-extrabold
        bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700
        bg-clip-text text-transparent
        mb-8 tracking-tight
        max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
        drop-shadow-sm cursor-pointer
      "
      >
        Match Types
      </h2>
      {isLoading && <Loading />}
      {isError && (
        <p className="text-center text-red-600">
          {error?.response?.data?.message || "Failed to load players"}
        </p>
      )}
      {!isLoading && !isError && matches.length === 0 && (
        <p className="text-center text-gray-500">No match types found.</p>
      )}
      {!isLoading && !isError && matches.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="overflow-x-auto">
            <div className="flex gap-6 py-4 snap-x snap-mandatory justify-around">
              {matches.map((match) => (
                <Link
                  key={match._id}
                  to={`/match-info/${match._id}`} //Change later
                  className="
                    flex-none w-64 sm:w-72 md:w-80
                    bg-white rounded-xl shadow-md overflow-hidden
                    hover:shadow-xl transition-shadow
                    snap-center
                  "
                >
                  <img
                    src={Image}
                    alt={match.name}
                    className="w-full h-56 object-contain rounded-t-xl"
                    loading="lazy"
                  />
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">
                      {match.name}
                    </h3>
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

export default MatchType;
