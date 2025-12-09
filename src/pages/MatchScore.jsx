import { useParams } from "react-router-dom";
import Loading from "../components/animation/Loading";
import { useMatch } from "../hooks/matches/useMatch";

const MatchScore = () => {
  const { matchId } = useParams();

  const { data: match, isLoading, isError } = useMatch(matchId);

  if (isLoading) return <Loading />;
  if (isError || !match) {
    return (
      <div className="text-center py-32 text-4xl text-red-600 font-bold">
        Match not found
      </div>
    );
  }

  const team1 = match.team_1;
  const team2 = match.team_2;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center mb-12">
          <h1 className="text-6xl font-extrabold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            {team1?.name} vs {team2?.name}
          </h1>
          <p className="text-2xl text-gray-700">
            {match.stage?.name} • Match {match.match_number}
          </p>
          <p className="text-xl text-gray-600 mt-4">
            {match.venue?.name} • {new Date(match.date).toLocaleDateString()}
          </p>
        </div>

        {/* Toss */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-12 text-center">
          <h2 className="text-4xl font-bold text-indigo-700 mb-8">Toss</h2>
          {match.toss_result ? (
            <div>
              <p className="text-3xl font-bold text-green-600">
                {match.toss_result.winner === team1?._id
                  ? team1?.name
                  : team2?.name}{" "}
                won the toss
              </p>
              <p className="text-2xl mt-4">
                Elected to{" "}
                <span className="font-bold text-blue-600">
                  {match.toss_result.decision === "BAT" ? "BAT" : "BOWL"}
                </span>
              </p>
            </div>
          ) : (
            <p className="text-2xl text-gray-500 italic">Toss pending</p>
          )}
        </div>

        {/* Teams */}
        <div className="grid md:grid-cols-2 gap-12">
          {[team1, team2].map((team) => (
            <div
              key={team?._id}
              className="bg-white rounded-3xl shadow-2xl p-10 text-center"
            >
              {team?.logo ? (
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-40 h-40 mx-auto rounded-full object-contain mb-6 shadow-xl"
                />
              ) : (
                <div className="w-40 h-40 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-6xl font-bold text-gray-500">
                  {team?.name?.[0]}
                </div>
              )}
              <h3 className="text-4xl font-bold text-gray-800">{team?.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchScore;
