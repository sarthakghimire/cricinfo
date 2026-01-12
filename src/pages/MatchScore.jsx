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
      <div className="text-center py-32 text-4xl text-gray-900 font-bold">
        Match not found
      </div>
    );
  }

  const team1 = match.team_1;
  const team2 = match.team_2;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm border-t-4 border-indigo-500 p-6 relative">
          {/* Status Badge */}
          <div className="flex justify-between items-start mb-6">
             <div>
              <p className="text-sm font-bold text-indigo-900 uppercase tracking-wide">
                {match.stage?.name} • Match {match.match_number}
              </p>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                {match.venue?.name} • {new Date(match.date).toLocaleDateString()}
              </p>
             </div>
             {isLive && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-100 rounded-full text-xs font-bold text-red-600 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  LIVE
                </div>
              )}
          </div>
          
          <div className="flex items-center justify-between px-4 sm:px-12">
            <div className="text-center">
              {team1?.logo && (
                 <img src={team1.logo} alt={team1.name} className="w-20 h-20 object-contain mx-auto mb-3" />
              )}
              <h2 className="text-lg font-bold text-gray-900">{team1?.name}</h2>
            </div>

            <div className="text-xl font-light text-gray-400">vs</div>

            <div className="text-center">
               {team2?.logo && (
                 <img src={team2.logo} alt={team2.name} className="w-20 h-20 object-contain mx-auto mb-3" />
              )}
              <h2 className="text-lg font-bold text-gray-900">{team2?.name}</h2>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
             {match.toss_result ? (
               <p className="text-sm text-gray-600">
                 <span className="font-semibold text-gray-900">
                   {match.toss_result.winner === team1?._id ? team1?.name : team2?.name}
                 </span>{" "}
                 won the toss and elected to{" "}
                 <span className="font-semibold text-gray-900">
                   {match.toss_result.decision === "BAT" ? "bat" : "bowl"}
                 </span>
               </p>
             ) : (
                <p className="text-sm text-gray-400 italic">Toss to happen</p>
             )}
          </div>
        </div>

        {/* Winner / Result Section */}
        <WinnerCalculator 
          innings={innings}
          team1={team1}
          team2={team2}
          match={match}
          calculateScore={calculateScoreFromDeliveries}
        />
        
        {/* Match Outcome (if result declared) */}
        {match.match_outcome && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-center">
            <p className="text-emerald-800 font-bold">{match.match_outcome}</p>
          </div>
        )}

        {/* Scorecards */}
        {loadingInnings ? (
          <Loading />
        ) : innings.length > 0 ? (
          <div className="space-y-6">
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
              <div className="bg-white border border-gray-200 border-dashed rounded-lg p-8 text-center opacity-75">
                 <p className="text-gray-400 font-medium text-lg">{team2?.name} yet to bat</p>
              </div>
            )}
          </div>
        ) : (
           <div className="text-center py-12 bg-white rounded-lg border border-gray-200 border-dashed">
              <p className="text-gray-400">Match has not started yet</p>
           </div>
        )}
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
  let winnerColorClass = "text-emerald-700";
  
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
    winnerColorClass = "text-orange-600";
  }
  
  // Display winner
  return (
    <div className="bg-white border-l-4 border-emerald-500 rounded-lg p-6 shadow-sm mb-6 text-center">
      <h2 className="text-xs uppercase tracking-widest text-emerald-600 mb-2 font-bold">Match Result</h2>
      <p className={`text-2xl font-bold ${winnerColorClass} mb-4`}>{winnerMessage}</p>
      
      <div className="max-w-xs mx-auto grid grid-cols-2 text-sm text-gray-600 border-t border-gray-100 pt-4 gap-4">
        <div className="text-right border-r border-gray-100 pr-4">
          <span className="block text-xs text-gray-400 mb-1">{firstInnings.batting_team?.name || team1?.name}</span>
          <span className="font-mono font-bold text-gray-800">{firstScore.runs}/{firstScore.wickets}</span>
        </div>
        <div className="text-left pl-4">
           <span className="block text-xs text-gray-400 mb-1">{secondInnings.batting_team?.name || team2?.name}</span>
           <span className="font-mono font-bold text-gray-800">{secondScore.runs}/{secondScore.wickets}</span>
        </div>
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-lg font-bold text-gray-900">
          {inning.batting_team?.name} <span className="text-xs font-normal text-indigo-500 ml-2 font-mono">INNINGS {inning.inning_number}</span>
        </h2>
        {inning.is_completed && (
          <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
            COMPLETED
          </span>
        )}
      </div>

      {isLoading ? (
        <Loading />
      ) : ( deliveries.length === 0 ? (<div className="text-center py-6"><p className="text-gray-400">Yet to bat</p></div>) : (
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-baseline gap-2 mb-6">
            <div className="font-mono text-5xl font-bold text-gray-900 tracking-tight">
              {score.runs}<span className="text-3xl text-gray-300 mx-1">/</span>{score.wickets}
            </div>
            <div className="text-gray-500 font-medium ml-2">
               in <span className="text-gray-800 font-bold">{score.overs}</span> overs
            </div>
          </div>
            
          {/* Show target for second innings */}
          {inning.inning_number === 2 && allInnings.length >= 1 && (
            <div className="mb-6 p-3 bg-blue-50 border border-blue-100 rounded text-sm text-blue-800">
                Target: <span className="font-bold">{calculateScore(allInnings[0]?.deliveries || []).runs + 1}</span> runs in {matchOvers} overs ({totalBalls} balls)
            </div>
          )}


          
          {/* Latest Ball Commentary */}
          {deliveries.length > 0 && deliveries[deliveries.length - 1].summary && (
             <div className="mb-8 bg-linear-to-r from-indigo-600 to-blue-600 rounded-lg p-0.5 shadow-sm">
                <div className="bg-white rounded-[7px] p-4 border-l-4 border-indigo-500">
                   <div className="flex items-start gap-3">
                      <div className="shrink-0 pt-1">
                         <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 ring-4 ring-indigo-50">
                            <svg className="h-3 w-3 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                         </span>
                      </div>
                      <div>
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                            Last Ball ({deliveries[deliveries.length - 1].over}.{deliveries[deliveries.length - 1].ball_number})
                         </p>
                         <p className="text-gray-900 font-medium leading-relaxed">
                            {deliveries[deliveries.length - 1].summary}
                         </p>
                      </div>
                   </div>
                </div>
             </div>
          )}

          <div className="grid grid-cols-3 gap-px bg-gray-200 rounded-lg overflow-hidden mb-8 border border-gray-200">
            <div className="text-center py-4 bg-white">
              <p className="text-[10px] uppercase tracking-wider text-blue-600 font-bold mb-1">Runs</p>
              <p className="text-2xl font-bold text-gray-900">{score.runs}</p>
            </div>
             <div className="text-center py-4 bg-white">
              <p className="text-[10px] uppercase tracking-wider text-red-600 font-bold mb-1">Wickets</p>
              <p className="text-2xl font-bold text-gray-900">{score.wickets}</p>
            </div>
             <div className="text-center py-4 bg-white">
              <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold mb-1">Overs</p>
              <p className="text-2xl font-bold text-gray-900">{score.overs}</p>
            </div>
          </div>

          {/* Recent Deliveries - Accordion for completed innings */}
          {recentDeliveries.length > 0 && (
            <div>
              <button
                onClick={() => setShowDeliveries(!showDeliveries)}
                className="w-full flex items-center justify-between text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors py-2 group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-600">Recent Deliveries</span>
                  <span className="text-xs text-gray-400 font-normal px-2 py-0.5 bg-gray-100 rounded-full">Last 6 balls</span>
                </div>
                <svg
                    className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform ${showDeliveries ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
              </button>
              
              {showDeliveries && (
                <div className="space-y-2 mt-3">
                  {recentDeliveries.map((delivery, index) => (
                    <div
                      key={delivery._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3 mb-1">
                          <span className="font-mono text-sm font-bold text-gray-500 w-10">
                            {delivery.over}.{delivery.ball_number}
                          </span>
                          <span className="text-sm font-bold text-gray-800">
                             {getPlayerName(delivery.batter)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 pl-14">
                           vs <span className="font-medium">{getPlayerName(delivery.bowler)}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {delivery.runs?.extras > 0 && (
                          <span className="text-[10px] text-gray-500 uppercase tracking-wide bg-white px-2 py-1 rounded border border-gray-200">
                            {delivery.extra_type ? delivery.extra_type.replace('_', ' ') : 'Extra'} (+{delivery.runs.extras})
                          </span>
                        )}
                        
                        {delivery.wicket ? (
                          <span className="w-8 h-8 flex items-center justify-center bg-red-600 text-white font-bold rounded-full text-xs shadow-sm">
                            W
                          </span>
                        ) : (
                          <span className={`w-8 h-8 flex items-center justify-center font-bold rounded-full text-sm shadow-sm ${
                            (delivery.runs?.batter || 0) >= 6
                              ? "bg-purple-600 text-white"
                              : (delivery.runs?.batter || 0) >= 4 ? "bg-blue-600 text-white" : "bg-white text-gray-700 border border-gray-200"
                          }`}>
                            {delivery.runs?.total || delivery.runs?.batter || 0}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))
    }
    </div>
  );
};

export default MatchScore;
