import React from "react";
import { getMatchById } from "../api/api";
import { Link, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { useQuery } from "@tanstack/react-query";
import DisplayDelivery from "../components/DisplayDelivery";

const MatchScore = () => {
  const { id } = useParams();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["match", id],
    queryFn: () => getMatchById(id),
  });

  const match = response?.data;

  if (isLoading) return <Loading />;
  if (isError || !match)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-2xl text-red-600">
          Match not found or error occurred
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-6 mt-8">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-8 px-10 text-center">
            <h1 className="text-4xl md:text-6xl font-black">
              {match.team_1.name}{" "}
              <span className="mx-6 text-yellow-300">VS</span>{" "}
              {match.team_2.name}
            </h1>
            <p className="text-xl mt-3 opacity-90">
              {match.tournament.name} • {match.tournament.season} • Match{" "}
              {match.match_number}
            </p>
            <p className="text-lg mt-2">
              {match.stage.name} •{" "}
              {new Date(match.date).toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Teams Grid */}
          <div className="grid md:grid-cols-2 gap-10 p-10">
            {/* Team 1 */}
            <div className="text-center">
              <img
                src={match.team_1.logo || "https://flagcdn.com/w320/np.png"}
                alt={match.team_1.name}
                onError={(e) =>
                  (e.target.src = "https://flagcdn.com/w320/np.png")
                }
                className="w-32 h-32 rounded-full mx-auto border-8 border-blue-200 shadow-2xl object-cover"
              />
              <h2 className="text-3xl font-bold text-blue-700 mt-6">
                {match.team_1.name}
              </h2>
              <p className="text-gray-600 italic">"{match.team_1.slogan}"</p>

              <div className="mt-8 bg-gray-50 rounded-2xl p-6 border-2 border-blue-100">
                <h3 className="font-bold text-lg mb-4">Playing XI</h3>
                <div className="grid grid-cols-1 gap-3 text-left">
                  {match.team_1.players.map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center gap-4 hover:bg-blue-100 px-3 py-2 rounded-lg transition"
                    >
                      <img
                        src={
                          p.player_image || "https://flagcdn.com/w320/np.png"
                        }
                        alt={p.player_name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                        onError={(e) =>
                          (e.target.src = "https://flagcdn.com/w320/np.png")
                        }
                      />
                      <span className="font-medium">{p.player_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Team 2 */}
            <div className="text-center">
              <img
                src={match.team_2.logo || "https://flagcdn.com/w320/np.png"}
                alt={match.team_2.name}
                onError={(e) =>
                  (e.target.src = "https://flagcdn.com/w320/np.png")
                }
                className="w-32 h-32 rounded-full mx-auto border-8 border-indigo-200 shadow-2xl object-cover"
              />
              <h2 className="text-3xl font-bold text-indigo-700 mt-6">
                {match.team_2.name}
              </h2>
              <p className="text-gray-600 italic">"{match.team_2.slogan}"</p>

              <div className="mt-8 bg-gray-50 rounded-2xl p-6 border-2 border-indigo-100">
                <h3 className="font-bold text-lg mb-4">Playing XI</h3>
                <div className="grid grid-cols-1 gap-3 text-left">
                  {match.team_2.players.map((p) => (
                    <div
                      key={p._id}
                      className="flex items-center gap-4 hover:bg-indigo-100 px-3 py-2 rounded-lg transition"
                    >
                      <img
                        src={
                          p.player_image || "https://flagcdn.com/w320/np.png"
                        }
                        alt={p.player_name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                        onError={(e) =>
                          (e.target.src = "https://flagcdn.com/w320/np.png")
                        }
                      />
                      <span className="font-medium">{p.player_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Match Info */}
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-8 border-t-4 border-blue-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center md:text-left">
              <div>
                <h3 className="font-bold text-xl text-gray-800 mb-4">
                  Match Details
                </h3>
                <p>
                  <strong>Venue:</strong> {match.venue.name},{" "}
                  {match.venue.address}
                </p>
                <p>
                  <strong>Capacity:</strong>{" "}
                  {match.venue.capacity.toLocaleString()} spectators
                </p>
                <p>
                  <strong>Description:</strong> {match.description}
                </p>
              </div>

              <div>
                <h3 className="font-bold text-xl text-gray-800 mb-4">
                  Toss & Target
                </h3>
                <p>
                  <strong>Toss Won By:</strong> {match.toss_result.winner.name}
                </p>
                <p>
                  <strong>Decision:</strong>{" "}
                  {match.toss_result.decision === "BOWL"
                    ? "Bowl First"
                    : "Bat First"}
                </p>
                {match.target && (
                  <p>
                    <strong>Target:</strong> {match.target.runs} runs in{" "}
                    {match.target.overs} overs
                    <br />
                    <span className="text-sm text-gray-600">
                      (Set for {match.target.team.name})
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Result */}
          {match.outcome && (
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-8 text-center">
              <h2 className="text-4xl font-black mb-3">
                {match.outcome.winner.name} WON!
              </h2>
              <p className="text-2xl">
                By {match.outcome.by.value}{" "}
                {match.outcome.by.by_type === "RUN" ? "RUNS" : "WICKETS"}
              </p>
              <p className="text-xl mt-3 opacity-90">{match.outcome.summary}</p>
            </div>
          )}
        </div>
      </div>
      <DisplayDelivery />
    </div>
  );
};

export default MatchScore;
