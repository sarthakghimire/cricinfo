import React from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";
import { getTournamentById } from "../api/api";
import { useParams, Link } from "react-router-dom";

const TournamentInfo = () => {
  const { id } = useParams();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tournament", id],
    queryFn: getTournamentById(id),
  });

  const tournament = response?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError || !tournament) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-2xl font-bold mb-4">
            Tournament not found
          </p>
          <Link
            to="/"
            className="px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-96 md:h-screen">
        <img
          src={tournament.banner_image}
          alt={tournament.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

        {/* Logo + Name */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-center">
          <img
            src={tournament.logo}
            alt={`${tournament.name} Logo`}
            className="w-32 h-32 md:w-48 md:h-48 mx-auto mb-6 rounded-full border-8 border-white/80 shadow-2xl object-contain bg-white"
          />
          <h1 className="text-5xl md:text-8xl font-extrabold text-white drop-shadow-2xl">
            {tournament.name}
          </h1>
          <p className="text-2xl md:text-4xl text-yellow-400 font-bold mt-4">
            Season {tournament.season}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Left: Details */}
          <div className="md:col-span-2 space-y-10">
            {/* Description */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">About</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {tournament.description}
              </p>
            </div>

            {/* Match Details */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Format</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-xl p-6 text-center">
                  <p className="text-sm text-blue-600 font-medium">
                    Match Type
                  </p>
                  <p className="text-2xl font-bold text-blue-800">
                    {tournament.match_type.name}
                  </p>
                </div>
                <div className="bg-indigo-50 rounded-xl p-6 text-center">
                  <p className="text-sm text-indigo-600 font-medium">Overs</p>
                  <p className="text-2xl font-bold text-indigo-800">
                    {tournament.total_overs} Overs
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl p-6 text-center">
                  <p className="text-sm text-purple-600 font-medium">
                    Tournament Type
                  </p>
                  <p className="text-2xl font-bold text-purple-800">
                    {tournament.tournament_type.name}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-6 text-center">
                  <p className="text-sm text-green-600 font-medium">Gender</p>
                  <p className="text-2xl font-bold text-green-800">
                    {tournament.gender === "M" ? "Men's" : "Women's"}
                  </p>
                </div>
              </div>
            </div>

            {/* Locations */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Venues</h2>
              <div className="flex flex-wrap gap-4">
                {tournament.locations.map((location, i) => (
                  <span
                    key={i}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full shadow-lg"
                  >
                    {location}
                  </span>
                ))}
              </div>
            </div>

            {/* Officials */}
            {tournament.officials.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Officials
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tournament.officials.map((official) => (
                    <Link
                      key={official._id}
                      to={`/official/${official._id}`}
                      className="group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-blue-200"
                    >
                      <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-700">
                        {official.name}
                      </h3>
                      <p className="text-sm text-indigo-600 font-medium capitalize mt-1">
                        {official.type.replace(/_/g, " ")}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Quick Info Card */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl shadow-2xl p-8 sticky top-6">
              <h3 className="text-2xl font-bold mb-6">Quick Info</h3>
              <div className="space-y-5">
                <div>
                  <p className="text-blue-200 text-sm">Total Matches</p>
                  <p className="text-3xl font-extrabold">32</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Teams</p>
                  <p className="text-3xl font-extrabold">8</p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Powerplay</p>
                  <p className="text-3xl font-extrabold">
                    {tournament.match_type.power_play_overs} Overs
                  </p>
                </div>
                <div>
                  <p className="text-blue-200 text-sm">Created</p>
                  <p className="text-xl font-medium">
                    {new Date(tournament.created_at).toLocaleDateString(
                      "en-GB"
                    )}
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/"
              className="block text-center py-5 bg-white border-2 border-blue-600 text-blue-600 font-bold text-xl rounded-2xl hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-xl"
            >
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentInfo;
