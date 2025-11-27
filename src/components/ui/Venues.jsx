import React from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "../animation/Loading";
import { getVenues } from "../../api/api";
import AnimatedCounter from "./../animation/AnimatedCounter";
import { Link } from "react-router-dom";

const Venues = () => {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["venues"],
    queryFn: getVenues,
  });

  const venues = response?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          Cricket Venues
        </h2>

        {isLoading && (
          <div className="flex justify-center py-20">
            <Loading />
          </div>
        )}

        {isError && (
          <div className="text-center py-20">
            <p className="text-2xl text-red-600 font-bold">
              {error?.response?.data?.message || "Failed to load venues"}
            </p>
          </div>
        )}

        {!isLoading && !isError && venues.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">No venues found.</p>
          </div>
        )}

        {!isLoading && !isError && venues.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {venues.map((venue) => (
              <Link
                to={`/venues/${venue._id}`}
                key={venue._id}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
              >
                <div className="h-56 bg-linear-to-br from-green-400 to-blue-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-3xl font-bold drop-shadow-lg">
                      {venue.name}
                    </h3>
                    {venue.address && (
                      <p className="text-sm opacity-90 mt-1 flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {venue.address.split(",")[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-8 text-center bg-linear-to-b from-white to-gray-50">
                  <p className="text-gray-600 text-sm uppercase tracking-wider mb-3">
                    Stadium Capacity
                  </p>
                  <div className="text-5xl font-extrabold text-indigo-600">
                    <AnimatedCounter
                      value={venue.capacity || 0}
                      duration={1800}
                      className="inline-block"
                    />
                    +
                  </div>
                  <p className="text-gray-500 mt-4 text-sm">
                    {venue.address || "Legendary cricket ground"}
                  </p>
                </div>

                <div className="absolute inset-0 border-4 border-transparent rounded-2xl group-hover:border-indigo-500/30 transition-all duration-500 pointer-events-none" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Venues;
