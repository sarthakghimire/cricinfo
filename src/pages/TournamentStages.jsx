import { useParams, Link } from "react-router-dom";
import Loading from "../components/animation/Loading";
import { useStagesByTournament } from "./../hooks/matches/useStagesByTournament";
import { useMatchTypes } from "./../hooks/matchTypes/useMatchTypes";
import { useTournaments } from "./../hooks/tournaments/useTournaments";
import { useOfficials } from "./../hooks/officials/useOfficials";

const TournamentStages = () => {
  const { id } = useParams();

  const {
    data: stageRes,
    isLoading: sLoad,
    isError: sErr,
    error: sError,
  } = useStagesByTournament(id);

  const { data: matchTypes } = useMatchTypes();
  const { data: tournamentTypes } = useTournaments();
  const { data: officials } = useOfficials();

  const stages = stageRes?.data || [];

  if (sLoad) return <Loading />;
  if (sErr)
    return <p className="text-center text-red-600 py-20">{sError?.message}</p>;
  if (!stages.length)
    return <p className="text-center py-20 text-gray-600">No stages found.</p>;

  const getName = (id, list) =>
    list?.data?.find((x) => x._id === id)?.name || "N/A";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Tournament Stages
        </h1>

        <div className="space-y-8">
          {stages.map((stage) => {
            const t = stage.tournament;
            const matchTypeName = getName(t.match_type, matchTypes);

            return (
              <div
                key={stage._id}
                className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
              >
                {/* Stage Header */}
                <div className="bg-blue-600 text-white p-6">
                  <h2 className="text-3xl font-bold">{stage.name}</h2>
                  <p className="text-xl mt-1 opacity-90">
                    {t.name} • {t.season}
                  </p>
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">
                        Format
                      </p>
                      <p className="text-2xl font-bold text-blue-700 mt-1">
                        {matchTypeName}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">Overs</p>
                      <p className="text-2xl font-bold text-green-700 mt-1">
                        {t.total_overs}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">
                        Balls/Over
                      </p>
                      <p className="text-2xl font-bold text-purple-700 mt-1">
                        {t.balls_per_over || 6}
                      </p>
                    </div>
                  </div>

                  {/* Officials */}
                  {t.officials && t.officials.length > 0 ? (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Assigned Officials
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {t.officials.map((officialId) => {
                          const official = officials?.data?.find(
                            (o) => o._id === officialId
                          );
                          if (!official) return null;

                          return (
                            <Link
                              key={official._id}
                              to={`/officials/${official._id}`}
                              className="inline-flex items-center gap-3 bg-gray-100 rounded-full px-5 py-3 hover:bg-gray-200 transition"
                            >
                              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                                {official.name.charAt(0)}
                              </div>
                              <span className="font-medium text-gray-800">
                                {official.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No officials assigned
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TournamentStages;
