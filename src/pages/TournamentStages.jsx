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
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-10">
          Tournament Stages
        </h1>

        <div className="space-y-6">
          {stages.map((stage) => {
            const t = stage.tournament;
            const matchTypeName = getName(t.match_type, matchTypes);

            return (
              <div
                key={stage._id}
                className="bg-white rounded-lg shadow-sm border-t-4 border-indigo-500 border-x border-b border-gray-200 overflow-hidden"
              >
                {/* Stage Header - Clean & Minimal */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{stage.name}</h2>
                    <p className="text-sm font-medium text-indigo-600 mt-1 uppercase tracking-wide">
                      {t.name} • {t.season}
                    </p>
                  </div>
                  <div className="flex gap-2">
                     <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
                        {matchTypeName}
                     </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-gray-200 rounded-lg overflow-hidden border border-gray-200 mb-6">
                    <div className="text-center py-4 bg-white">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">
                        Format
                      </p>
                      <p className="text-xl font-bold text-blue-700">
                        {matchTypeName}
                      </p>
                    </div>
                    <div className="text-center py-4 bg-white">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Overs</p>
                      <p className="text-xl font-bold text-emerald-700">
                        {t.total_overs}
                      </p>
                    </div>
                    <div className="text-center py-4 bg-white">
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">
                        Balls/Over
                      </p>
                      <p className="text-xl font-bold text-purple-700">
                        {t.balls_per_over || 6}
                      </p>
                    </div>
                  </div>

                  {/* Officials */}
                  {t.officials && t.officials.length > 0 ? (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        Officials
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
                              className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full pl-1 pr-3 py-1 hover:bg-white hover:border-indigo-300 hover:shadow-sm transition group"
                            >
                              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                                {official.name.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                {official.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">
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
