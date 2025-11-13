import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import {
  getStagesById,
  getMatchType,
  getTournaments,
  getOfficials,
} from "./../api/api";
import Loading from "../components/Loading";

const TournamentStages = () => {
  const { id } = useParams();

  const {
    data: stageRes,
    isLoading: sLoad,
    isError: sErr,
    error: sError,
  } = useQuery({
    queryKey: ["stage", id],
    queryFn: () => getStagesById(id),
  });

  const { data: matchTypes } = useQuery({
    queryKey: ["match-types"],
    queryFn: getMatchType,
  });
  const { data: tournamentTypes } = useQuery({
    queryKey: ["tournament-types"],
    queryFn: getTournaments,
  });
  const { data: officials } = useQuery({
    queryKey: ["officials"],
    queryFn: getOfficials,
  });

  const stages = stageRes?.data || [];

  if (sLoad) return <Loading />;
  if (sErr)
    return <p className="text-center text-red-600 py-20">{sError?.message}</p>;
  if (!stages.length)
    return <p className="text-center py-20 text-gray-600">No stages found.</p>;

  const getName = (id, list) =>
    list?.data?.find((x) => x._id === id)?.name || "N/A";
  const getOfficialNames = (ids) =>
    ids
      ?.map((id) => getName(id, officials))
      .filter(Boolean)
      .join(" • ") || "Not Assigned";

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-6xl font-extrabold text-center mb-12 bg-gradient-to-r from-red-600 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
            Tournament Stages
          </h1>

          {stages.map((stage) => {
            const t = stage.tournament;
            const matchTypeName = getName(t.match_type, matchTypes);
            const tournamentTypeName = getName(
              t.tournament_type,
              tournamentTypes
            );
            const officialNames = getOfficialNames(t.officials);

            return (
              <div
                key={stage._id}
                className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16 border-4 border-gray-200"
              >
                {/* Banner */}
                <div
                  className="h-72 bg-cover bg-center relative"
                  style={{
                    backgroundImage: `url(${
                      t.banner_image || "/npl_banner.png"
                    })`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <h2 className="text-5xl font-extrabold drop-shadow-2xl">
                      {stage.name}
                    </h2>
                    <p className="text-2xl mt-2 font-medium opacity-90">
                      {t.season}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-10">
                  <p className="text-xl text-gray-700 mb-10 leading-relaxed italic">
                    "{t.description}"
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <Link
                      to={`/match-info/${t.match_type}`}
                      className="bg-blue-50 rounded-2xl p-8 border-4 border-blue-200 text-center"
                    >
                      <p className="text-blue-600 font-bold text-lg">Format</p>
                      <p className="text-4xl font-extrabold text-blue-800 mt-2">
                        {matchTypeName}
                      </p>
                    </Link>
                    <div className="bg-green-50 rounded-2xl p-8 border-4 border-green-200 text-center">
                      <p className="text-green-600 font-bold text-lg">
                        Total Overs
                      </p>
                      <p className="text-4xl font-extrabold text-green-800 mt-2">
                        {t.total_overs}
                      </p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 rounded-2xl p-8 border-4 border-yellow-200">
                    <p className="text-yellow-800 font-bold text-xl mb-6">
                      Officials
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {t.officials && t.officials.length > 0 ? (
                        t.officials.map((officialId) => {
                          const official = officials?.data?.find(
                            (o) => o._id === officialId
                          );
                          if (!official) return null;

                          return (
                            <Link
                              key={official._id}
                              to={`/officials/${official._id}`}
                              className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-4 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-yellow-300 hover:border-yellow-500 group"
                            >
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                                {official.name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-gray-800 group-hover:text-yellow-700">
                                  {official.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {official.role || "Official"}
                                </p>
                              </div>
                              <span className="text-yellow-600 group-hover:text-yellow-800 text-xs">
                                View Profile →
                              </span>
                            </Link>
                          );
                        })
                      ) : (
                        <p className="text-gray-600 italic">
                          No officials assigned
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TournamentStages;
