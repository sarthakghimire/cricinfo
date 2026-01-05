import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import Loading from "../components/animation/Loading";
import { useMatch } from "../hooks/matches/useMatch";
import { useInningsByMatch } from "../hooks/innings/useInningsByMatch";
import { useDeliveriesByInning } from "../hooks/deliveries/useDeliveriesByInning";
import { usePlayers } from "../hooks/players/usePlayers";

const MatchScore = () => {
  const { id } = useParams();
  const [isLive, setIsLive] = useState(true); // Always show as live when auto-polling

  const { data: match, isLoading, isError } = useMatch(id, {
    refetchInterval: 3000,
  });
  const { data: inningsData, isLoading: loadingInnings } = useInningsByMatch(id, {
    refetchInterval: 3000,
  });
  
  // Fetch all players to map IDs to names
  const { data: playersData } = usePlayers(1, 500);
  
  // Create a player lookup map
  const playerMap = useMemo(() => {
    if (!playersData?.data) return {};
    return playersData.data.reduce((map, player) => {
      map[player._id] = player;
      return map;
    }, {});
  }, [playersData]);

  const innings = inningsData?.data || [];

  // Calculate scores from deliveries for each innings
  const calculateScoreFromDeliveries = (deliveries) => {
    if (!deliveries || deliveries.length === 0) {
      return { runs: 0, wickets: 0, overs: "0.0" };
    }

    const totalRuns = deliveries.reduce((sum, d) => {
      return sum + (d.runs?.total || d.runs?.batter || 0) + (d.runs?.extras || 0);
    }, 0);

    const wickets = deliveries.filter(d => d.wicket).length;

    // Calculate overs from ball count
    const totalBalls = deliveries.length;
    const completedOvers = Math.floor(totalBalls / 6);
    const remainingBalls = totalBalls % 6;
    const overs = remainingBalls > 0 ? `${completedOvers}.${remainingBalls}` : `${completedOvers}.0`;

    return { runs: totalRuns, wickets, overs };
  };
  
  // Helper to get player name from ID or object
  const getPlayerName = (player) => {
    if (!player) return "N/A";
    if (typeof player === 'string') {
      // It's an ID, look it up in playerMap
      return playerMap[player]?.name || "N/A";
    }
    // It's already an object with name
    return player.name || "N/A";
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <WinnerCalculator 
          innings={innings}
          team1={team1}
          team2={team2}
          match={match}
          calculateScore={calculateScoreFromDeliveries}
        />
        
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center mb-12 relative">
          {/* LIVE Indicator */}
          {isLive && (
            <div className="absolute top-6 right-6 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full animate-pulse">
              <span className="w-3 h-3 bg-white rounded-full animate-ping"></span>
              <span className="font-bold">LIVE</span>
            </div>
          )}
          
          <h1 className="text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            {team1?.name} vs {team2?.name}
          </h1>
          <p className="text-2xl text-gray-700">
            {match.stage?.name} • Match {match.match_number}
          </p>
          <p className="text-xl text-gray-600 mt-4">
            {match.venue?.name} • {new Date(match.date).toLocaleDateString()}
          </p>
            <div className="bg-white rounded-2xl shadow-xl p-10 mb-12 text-center">
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
        </div>

        {/* Match Outcome */}
        {match.match_outcome && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 mb-12 text-center">
            <h2 className="text-3xl font-bold text-white">{match.match_outcome}</h2>
          </div>
        )}

        {/* Innings Scorecards */}
        {loadingInnings ? (
          <Loading />
        ) : innings.length > 0 ? (
          <div className="space-y-6 mb-12">
            {innings.map((inning) => (
              <InningsScorecard 
                key={inning._id} 
                inning={inning} 
                calculateScore={calculateScoreFromDeliveries} 
                getPlayerName={getPlayerName}
                match={match}
                allInnings={innings}
              />
            ))}
            
            {/* Show "Yet to bat" for second team if only first innings exists */}
            {innings.length === 1 && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  {team2?.logo && (
                    <img 
                      src={team2.logo} 
                      alt={team2.name}
                      className="w-16 h-16 object-contain"
                    />
                  )}
                  <h2 className="text-3xl font-bold text-gray-800">
                    {team2?.name}
                  </h2>
                </div>
                <div className="text-center py-8">
                  <p className="text-4xl font-bold text-gray-500">Yet to bat</p>
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

// Component to calculate and display winner when both innings are completed
const WinnerCalculator = ({ innings, team1, team2, match, calculateScore }) => {
  // Find both innings
  const firstInnings = innings.find(i => i.number === 1);
  const secondInnings = innings.find(i => i.number === 2);
  
  // Fetch deliveries for both innings
  const { data: firstInningsDeliveriesData } = useDeliveriesByInning(firstInnings?._id, {
    refetchInterval: 3000,
  });
  const { data: secondInningsDeliveriesData } = useDeliveriesByInning(secondInnings?._id, {
    refetchInterval: 3000,
  });
  
  const firstInningsDeliveries = firstInningsDeliveriesData?.data || [];
  const secondInningsDeliveries = secondInningsDeliveriesData?.data || [];
  
  // Only calculate if both innings are completed
  if (!firstInnings?.is_completed || !secondInnings?.is_completed) {
    return null;
  }
  
  // Calculate scores
  const firstScore = calculateScore(firstInningsDeliveries);
  const secondScore = calculateScore(secondInningsDeliveries);
  
  // Determine winner based on cricket rules
  let winnerMessage = "";
  
  if (secondScore.runs > firstScore.runs) {
    // Second innings team won
    const wicketsRemaining = 10 - secondScore.wickets;
    const winnerTeam = secondInnings.batting_team?.name || team2?.name;
    winnerMessage = `${winnerTeam} won by ${wicketsRemaining} wicket${wicketsRemaining !== 1 ? 's' : ''}`;
  } else if (firstScore.runs > secondScore.runs) {
    // First innings team won
    const runsDifference = firstScore.runs - secondScore.runs;
    const winnerTeam = firstInnings.batting_team?.name || team1?.name;
    winnerMessage = `${winnerTeam} won by ${runsDifference} run${runsDifference !== 1 ? 's' : ''}`;
  } else {
    // Tie
    winnerMessage = "Match Tied";
  }
  
  // Display winner
  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 mb-12 text-center">
      <h2 className="text-4xl font-bold text-white mb-2">Match Result</h2>
      <p className="text-3xl font-bold text-white">{winnerMessage}</p>
      <div className="mt-4 text-white text-lg">
        <p>{firstInnings.batting_team?.name || team1?.name}: {firstScore.runs}/{firstScore.wickets}</p>
        <p>{secondInnings.batting_team?.name || team2?.name}: {secondScore.runs}/{secondScore.wickets}</p>
      </div>
    </div>
  );
};

// Separate component to fetch deliveries and display scorecard
const InningsScorecard = ({ inning, calculateScore, getPlayerName, match, allInnings }) => {
  const [showDeliveries, setShowDeliveries] = useState(false);
  const { data: deliveriesData, isLoading } = useDeliveriesByInning(inning._id, {
    refetchInterval: 3000,
  });
  const deliveries = deliveriesData?.data || [];
  
  const score = calculateScore(deliveries);
  const recentDeliveries = deliveries.slice(-6).reverse();

  // Get match format overs (default to 20 if not available)
  const matchOvers = match?.format || match?.overs || 20;
  const totalBalls = matchOvers * 6;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          {inning.batting_team?.logo && (
            <img 
              src={inning.batting_team.logo} 
              alt={inning.batting_team.name}
              className="w-16 h-16 object-contain"
            />
          )}
          <h2 className="text-3xl font-bold text-gray-800">
            {inning.batting_team?.name} - Innings {inning.inning_number}
          </h2>
        </div>
        {inning.is_completed && (
          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
            Completed
          </span>
        )}
      </div>

      {isLoading ? (
        <Loading />
      ) : ( deliveries.length === 0 ? (<div className="text-center py-8"><p className="text-4xl font-bold text-gray-500">Yet to bat</p></div>) : (
        <>
          <div className="text-center">
            <p className="text-6xl font-bold text-indigo-600 mb-2">
              {score.runs}/{score.wickets}
            </p>
            <p className="text-2xl text-gray-600">in {score.overs} overs</p>
            
            {/* Show target for second innings */}
            {inning.inning_number === 2 && allInnings.length >= 1 && (
              <div className="mt-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 inline-block">
                <p className="text-lg font-semibold text-yellow-800">
                  Target = {calculateScore(allInnings[0]?.deliveries || []).runs + 1} runs in {matchOvers} overs ({totalBalls} balls)
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Runs</p>
              <p className="text-2xl font-bold text-blue-600">{score.runs}</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Wickets</p>
              <p className="text-2xl font-bold text-red-600">{score.wickets}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Overs</p>
              <p className="text-2xl font-bold text-green-600">{score.overs}</p>
            </div>
          </div>

          {/* Recent Deliveries - Accordion for completed innings */}
          {recentDeliveries.length > 0 && (
            <div className="mt-8">
              <button
                onClick={() => setShowDeliveries(!showDeliveries)}
                className="w-full flex items-center justify-between text-lg font-bold text-gray-800 mb-4 p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <span>Recent Deliveries</span>
                <svg
                  className={`w-6 h-6 transition-transform ${showDeliveries ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showDeliveries && (
                <div className="space-y-2">
                  {recentDeliveries.map((delivery, index) => (
                    <div
                      key={delivery._id}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                        index === 0 && !inning.is_completed
                          ? "border-green-500 bg-green-50 animate-pulse"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono font-bold text-gray-700">
                            {delivery.over}.{delivery.ball_number}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-semibold text-gray-800">{getPlayerName(delivery.batter)} (S)</span>
                          {" • "}
                          <span>{getPlayerName(delivery.non_striker)} (NS)</span>
                          {" • "}
                          <span>vs {getPlayerName(delivery.bowler)} (B)</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {delivery.wicket ? (
                          <span className="px-3 py-1 bg-red-600 text-white font-bold rounded-full">
                            W
                          </span>
                        ) : (
                          <span className={`px-3 py-1 font-bold rounded-full ${
                            (delivery.runs?.batter || 0) >= 4
                              ? "bg-green-600 text-white"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {delivery.runs?.total || delivery.runs?.batter || 0}
                          </span>
                        )}
                        {delivery.runs?.extras > 0 && (
                          <span className="text-xs text-orange-600 font-semibold">
                            +{delivery.runs.extras}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      ))
    }
    </div>
  );
};

export default MatchScore;
