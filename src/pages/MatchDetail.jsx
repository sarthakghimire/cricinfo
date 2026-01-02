import { useParams, useNavigate } from "react-router-dom";
import { useMatch } from "../hooks/matches/useMatch";
import { useInningsByMatch } from "../hooks/innings/useInningsByMatch";
import Loading from "../components/animation/Loading";

const MatchDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: matchData, isLoading: loadingMatch } = useMatch(id);
  const { data: inningsData, isLoading: loadingInnings } = useInningsByMatch(id);

  const match = matchData;
  const innings = inningsData?.data || [];

  if (loadingMatch) return <Loading />;

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Match not found</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Match Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {match.team_1?.name} vs {match.team_2?.name}
            </h1>
            <p className="text-gray-600">
              {match.tournament?.name} • {match.venue?.name}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              {match.match_date ? new Date(match.match_date).toLocaleDateString() : "Date TBA"}
            </p>
          </div>

          {match.match_outcome && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-green-800 font-semibold text-lg">{match.match_outcome}</p>
            </div>
          )}
        </div>

        {/* Innings Scorecards */}
        <div className="space-y-6">
          {loadingInnings ? (
            <Loading />
          ) : innings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-500">No innings data available yet</p>
            </div>
          ) : (
            innings.map((inning) => (
              <div key={inning._id} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {inning.batting_team?.name} - Innings {inning.inning_number}
                  </h2>
                  {inning.is_completed && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Completed
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-gray-600 text-sm mb-1">Runs</p>
                    <p className="text-3xl font-bold text-blue-600">{inning.total_runs || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-gray-600 text-sm mb-1">Wickets</p>
                    <p className="text-3xl font-bold text-red-600">{inning.wickets || 0}</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-gray-600 text-sm mb-1">Overs</p>
                    <p className="text-3xl font-bold text-green-600">{inning.overs || 0}</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-800">
                    {inning.total_runs || 0}/{inning.wickets || 0}
                  </p>
                  <p className="text-gray-600 mt-1">in {inning.overs || 0} overs</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-8 py-3 rounded-lg transition"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchDetail;
