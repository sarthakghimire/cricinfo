import { useState } from "react";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useMatches } from "../../hooks/matches/useMatches";
import { useMatch } from "../../hooks/matches/useMatch";
import { useTeams } from "../../hooks/teams/useTeams";
import { useTeam } from "../../hooks/teams/useTeam";
import { usePlayers } from "../../hooks/players/usePlayers";
import { useInningsByMatch } from "../../hooks/innings/useInningsByMatch";
import { useCreateInning } from "../../hooks/innings/useCreateInning";
import { useUpdateInning } from "../../hooks/innings/useUpdateInning";
import { useDeleteInning } from "../../hooks/innings/useDeleteInning";
import { useDeliveriesByInning } from "../../hooks/deliveries/useDeliveriesByInning";
import { useCreateDelivery } from "../../hooks/deliveries/useCreateDelivery";
import { useUpdateToss } from "../../hooks/matches/useUpdateToss";
import { useDeleteMatch } from "../../hooks/matches/useDeleteMatch";
import { useDeleteDelivery } from "../../hooks/deliveries/useDeleteDelivery";
import { useMatchPlayers } from "../../hooks/matches/useMatchPlayers";
import { useAddMatchPlayer } from "../../hooks/matches/useAddMatchPlayer";
import { useRemoveMatchPlayer } from "../../hooks/matches/useRemoveMatchPlayer";
import { useTournaments } from "../../hooks/tournaments/useTournaments";

const ManageMatch = () => {
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedInningId, setSelectedInningId] = useState("");
  const [activeTab, setActiveTab] = useState("toss"); // toss, innings, or deliveries

  // Toss form state
  const [tossForm, setTossForm] = useState({
    winner: "",
    decision: "BAT",
  });

  // Innings form state
  const [inningForm, setInningForm] = useState({
    batting_team: "",
    inning_number: "1",
  });

  // Delivery form state
  const [deliveryForm, setDeliveryForm] = useState({
    over: "",
    ball: "",
    batter: "",
    non_striker: "",
    bowler: "",
    runs: "0",
    is_boundary: false,
    is_six: false,
    is_wide: false,
    is_no_ball: false,
    is_wicket: false,
    wicket_type: "",
    fielder: "",
  });

  // Track current striker and non-striker for display
  const [currentStriker, setCurrentStriker] = useState("");
  const [currentNonStriker, setCurrentNonStriker] = useState("");

  // Match format state for determining total overs
  const [matchFormat, setMatchFormat] = useState("T20"); // T20, ODI, Test, Custom
  const [customOvers, setCustomOvers] = useState(20);

  const { data: matchesRes, isLoading: loadingMatches } = useMatches(1, 100);
  const { data: tournamentsRes } = useTournaments();
  const { data: matchDetails } = useMatch(selectedMatch?._id);
  const { data: teamsRes } = useTeams();
  const { data: playersRes } = usePlayers(1, 200);
  
  // Define currentMatch before its usage in other hooks
  const currentMatch = matchDetails || selectedMatch;

  const { data: inningsRes, isLoading: loadingInnings } = useInningsByMatch(selectedMatch?._id);
  const { data: deliveriesRes, isLoading: loadingDeliveries } = useDeliveriesByInning(selectedInningId);
  const { data: matchPlayersRes } = useMatchPlayers(selectedMatch?._id);
  
  // Fetch full team data with players for Playing XI
  const { data: team1Data } = useTeam(currentMatch?.team_1?._id || currentMatch?.team_1);
  const { data: team2Data } = useTeam(currentMatch?.team_2?._id || currentMatch?.team_2);

  const allMatches = matchesRes?.data || [];
  const tournaments = tournamentsRes?.data || [];
  const teams = teamsRes?.data || [];
  const players = playersRes?.data || [];
  const innings = inningsRes?.data || [];
  const deliveries = deliveriesRes?.data || [];
  const matchPlayers = matchPlayersRes || [];
  
  // Filter matches by selected tournament
  const matches = selectedTournament 
    ? allMatches.filter(match => match.tournament?._id === selectedTournament || match.tournament === selectedTournament)
    : allMatches;

  // Get all players for a specific team (no Playing XI filtering)
  const getTeamPlayers = (teamId) => {
    if (!currentMatch || !teamId) return [];
    
    // Determine which team and return their players
    if (currentMatch.team_1?._id === teamId || currentMatch.team_1 === teamId) {
      return team1Data?.players || [];
    } else if (currentMatch.team_2?._id === teamId || currentMatch.team_2 === teamId) {
      return team2Data?.players || [];
    }
    
    return [];
  };

  // Determine total overs based on format
  const getTotalOvers = () => {
    switch (matchFormat) {
      case "T20":
        return 20;
      case "ODI":
        return 50;
      case "Test":
        return 90; // Test matches typically have 90 overs per day
      case "Custom":
        return customOvers;
      default:
        return 20;
    }
  };

  const totalOvers = getTotalOvers();

  const createInningMutation = useCreateInning();
  const updateInningMutation = useUpdateInning();
  const deleteInningMutation = useDeleteInning();
  const createDeliveryMutation = useCreateDelivery();
  const deleteDeliveryMutation = useDeleteDelivery();
  const updateTossMutation = useUpdateToss();
  const deleteMatchMutation = useDeleteMatch();
  const addMatchPlayerMutation = useAddMatchPlayer();
  const removeMatchPlayerMutation = useRemoveMatchPlayer();

  const handleUpdateToss = (e) => {
    e.preventDefault();
    
    // Determine which team bats first based on toss decision
    const battingFirstTeam = tossForm.decision === "BAT" ? tossForm.winner : 
      (tossForm.winner === selectedMatch.team_1?._id ? selectedMatch.team_2?._id : selectedMatch.team_1?._id);
    
    const battingSecondTeam = battingFirstTeam === selectedMatch.team_1?._id ? 
      selectedMatch.team_2?._id : selectedMatch.team_1?._id;

    updateTossMutation.mutate(
      {
        matchId: selectedMatch._id,
        tossData: {
          winner: tossForm.winner,
          decision: tossForm.decision,
        },
      },
      {
        onSuccess: () => {
          toast.success("Toss updated successfully!");
          
          // Automatically create both innings
          createInningMutation.mutate(
            {
              match: selectedMatch._id,
              batting_team: battingFirstTeam,
              number: 1,
            },
            {
              onSuccess: () => {
                // Create second innings
                createInningMutation.mutate(
                  {
                    match: selectedMatch._id,
                    batting_team: battingSecondTeam,
                    number: 2,
                  },
                  {
                    onSuccess: () => {
                      toast.success("Both innings created automatically!");
                    },
                    onError: (error) => {
                      toast.error(error.response?.data?.message || "Failed to create 2nd innings");
                    },
                  }
                );
              },
              onError: (error) => {
                toast.error(error.response?.data?.message || "Failed to create 1st innings");
              },
            }
          );
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to update toss");
        },
      }
    );
  };

  const handleDeleteMatch = () => {
    if (window.confirm(`Delete match "${selectedMatch.team_1?.name} vs ${selectedMatch.team_2?.name}"? This will delete all innings and deliveries. This cannot be undone.`)) {
      deleteMatchMutation.mutate(selectedMatch._id, {
        onSuccess: () => {
          setSelectedMatch(null);
          setSelectedInningId("");
          setActiveTab("toss");
        },
      });
    }
  };

  const handleCreateInning = (e) => {
    e.preventDefault();
    createInningMutation.mutate(
      {
        match: selectedMatch._id,
        batting_team: inningForm.batting_team,
        number: Number(inningForm.inning_number),
      },
      {
        onSuccess: () => {
          toast.success("Innings created successfully!");
          setInningForm({ batting_team: "", inning_number: "1" });
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to create innings");
        },
      }
    );
  };

  const handleCompleteInning = (id) => {
    if (window.confirm("Mark this innings as completed?")) {
      updateInningMutation.mutate(
        { id, data: { is_completed: true } },
        {
          onSuccess: () => toast.success("Innings completed!"),
          onError: () => toast.error("Failed to complete innings"),
        }
      );
    }
  };

  const handleDeleteInning = (id) => {
    if (window.confirm("Delete this innings? This cannot be undone.")) {
      deleteInningMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Innings deleted");
          if (selectedInningId === id) setSelectedInningId("");
        },
        onError: () => toast.error("Failed to delete innings"),
      });
    }
  };

  const handleRecordDelivery = (e) => {
    e.preventDefault();

    // Calculate extras
    let extras = 0;
    if (deliveryForm.is_wide) extras += 1;
    if (deliveryForm.is_no_ball) extras += 1;

    const deliveryData = {
      inning: selectedInningId,
      over: Number(deliveryForm.over),
      ball_number: Number(deliveryForm.ball),
      batter: deliveryForm.batter,
      non_striker: deliveryForm.non_striker,
      bowler: deliveryForm.bowler,
      runs: {
        batter: Number(deliveryForm.runs),
        extras: extras,
      },
    };

    // Add wicket details if applicable
    if (deliveryForm.is_wicket) {
      deliveryData.wicket = {
        type: deliveryForm.wicket_type,
      };
      if (deliveryForm.fielder) {
        deliveryData.wicket.fielder = deliveryForm.fielder;
      }
    }

    createDeliveryMutation.mutate(deliveryData, {
      onSuccess: () => {
        toast.success("Delivery recorded!");
        
        // Determine if strikers should swap based on cricket rules
        const runs = Number(deliveryForm.runs);
        const isWide = deliveryForm.is_wide;
        const isNoBall = deliveryForm.is_no_ball;
        const currentBall = Number(deliveryForm.ball);
        
        let shouldSwap = false;
        
        // Rule 1: Odd runs (1, 3, 5) = swap strikers (only for legal deliveries)
        if (!isWide && runs % 2 === 1) {
          shouldSwap = true;
        }
        
        // Rule 2: End of over (ball 6) = swap strikers
        if (currentBall === 6 && !isWide && !isNoBall) {
          shouldSwap = !shouldSwap; // Toggle the swap
        }
        
        // Update striker/non-striker for next delivery
        if (shouldSwap) {
          setCurrentStriker(deliveryForm.non_striker);
          setCurrentNonStriker(deliveryForm.batter);
          setDeliveryForm({
            ...deliveryForm,
            batter: deliveryForm.non_striker,
            non_striker: deliveryForm.batter,
            ball: String(Number(deliveryForm.ball) + 1),
            runs: "0",
            is_boundary: false,
            is_six: false,
            is_wide: false,
            is_no_ball: false,
            is_wicket: false,
            wicket_type: "",
            fielder: "",
          });
        } else {
          setCurrentStriker(deliveryForm.batter);
          setCurrentNonStriker(deliveryForm.non_striker);
          setDeliveryForm({
            ...deliveryForm,
            ball: String(Number(deliveryForm.ball) + 1),
            runs: "0",
            is_boundary: false,
            is_six: false,
            is_wide: false,
            is_no_ball: false,
            is_wicket: false,
            wicket_type: "",
            fielder: "",
          });
        }
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to record delivery");
      },
    });
  };

  const handleDeleteDelivery = (id) => {
    if (window.confirm("Delete this delivery?")) {
      deleteDeliveryMutation.mutate(id, {
        onSuccess: () => toast.success("Delivery deleted"),
        onError: () => toast.error("Failed to delete delivery"),
      });
    }
  };

  if (loadingMatches) return <Loading />;

  // Step 1: Match Selection
  if (!selectedMatch) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Select a Match</h2>
          
          {/* Tournament Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Tournament
            </label>
            <select
              value={selectedTournament || ""}
              onChange={(e) => setSelectedTournament(e.target.value || null)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Tournaments</option>
              {tournaments.map((tournament) => (
                <option key={tournament._id} value={tournament._id}>
                  {tournament.name} {tournament.season ? `(${tournament.season})` : ""}
                </option>
              ))}
            </select>
          </div>

          {matches.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No matches found</p>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <div
                  key={match._id}
                  onClick={() => setSelectedMatch(match)}
                  className="bg-gray-50 border border-gray-200 p-6 rounded-lg hover:shadow-lg hover:border-blue-400 transition cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {match.team_1?.name} vs {match.team_2?.name}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>
                          <span className="font-semibold">Tournament:</span> {match.tournament?.name || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Venue:</span> {match.venue?.name || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Date:</span>{" "}
                          {match.match_date ? new Date(match.match_date).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          match.match_outcome
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {match.match_outcome ? "Completed" : "Active"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 2: Manage Selected Match (Innings & Deliveries)
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Match Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedMatch.team_1?.name} vs {selectedMatch.team_2?.name}
            </h2>
            <p className="text-gray-600 mt-1">
              {selectedMatch.tournament?.name} • {selectedMatch.venue?.name}
            </p>
            {currentMatch?.toss_result && (
              <p className="text-sm text-green-600 font-semibold mt-2">
                Toss: {currentMatch.toss_result.winner === selectedMatch.team_1?._id ? selectedMatch.team_1?.name : selectedMatch.team_2?.name} won, chose to {currentMatch.toss_result.decision}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDeleteMatch}
              disabled={deleteMatchMutation.isPending}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-bold px-6 py-2 rounded-lg transition"
            >
              {deleteMatchMutation.isPending ? "Deleting..." : "Delete Match"}
            </button>
            <button
              onClick={() => {
                setSelectedMatch(null);
                setSelectedInningId("");
                setActiveTab("toss");
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold px-6 py-2 rounded-lg transition"
            >
              ← Back to Matches
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("toss")}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === "toss"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Toss
          </button>
          <button
            onClick={() => setActiveTab("innings")}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === "innings"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Manage Innings
          </button>
          <button
            onClick={() => setActiveTab("deliveries")}
            className={`flex-1 px-6 py-4 font-semibold transition ${
              activeTab === "deliveries"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Record Deliveries
          </button>
        </div>

        {/* Toss Tab */}
        {activeTab === "toss" && (
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Update Toss Result</h3>
            <form onSubmit={handleUpdateToss} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Toss Winner
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`flex items-center justify-center p-6 rounded-lg border-2 cursor-pointer transition ${
                      tossForm.winner === selectedMatch.team_1?._id
                        ? "border-purple-600 bg-purple-600 text-white font-bold"
                        : "border-gray-300 bg-white hover:border-purple-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="winner"
                      value={selectedMatch.team_1?._id}
                      checked={tossForm.winner === selectedMatch.team_1?._id}
                      onChange={(e) => setTossForm({ ...tossForm, winner: e.target.value })}
                      className="sr-only"
                      required
                    />
                    <span className="text-lg">{selectedMatch.team_1?.name}</span>
                  </label>
                  <label
                    className={`flex items-center justify-center p-6 rounded-lg border-2 cursor-pointer transition ${
                      tossForm.winner === selectedMatch.team_2?._id
                        ? "border-purple-600 bg-purple-600 text-white font-bold"
                        : "border-gray-300 bg-white hover:border-purple-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="winner"
                      value={selectedMatch.team_2?._id}
                      checked={tossForm.winner === selectedMatch.team_2?._id}
                      onChange={(e) => setTossForm({ ...tossForm, winner: e.target.value })}
                      className="sr-only"
                      required
                    />
                    <span className="text-lg">{selectedMatch.team_2?.name}</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Elected to
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label
                    className={`flex items-center justify-center p-6 rounded-lg border-2 cursor-pointer transition ${
                      tossForm.decision === "BAT"
                        ? "border-green-600 bg-green-600 text-white font-bold"
                        : "border-gray-300 bg-white hover:border-green-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="decision"
                      value="BAT"
                      checked={tossForm.decision === "BAT"}
                      onChange={(e) => setTossForm({ ...tossForm, decision: e.target.value })}
                      className="sr-only"
                    />
                    <span className="text-lg">BAT</span>
                  </label>
                  <label
                    className={`flex items-center justify-center p-6 rounded-lg border-2 cursor-pointer transition ${
                      tossForm.decision === "BOWL"
                        ? "border-blue-600 bg-blue-600 text-white font-bold"
                        : "border-gray-300 bg-white hover:border-blue-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="decision"
                      value="BOWL"
                      checked={tossForm.decision === "BOWL"}
                      onChange={(e) => setTossForm({ ...tossForm, decision: e.target.value })}
                      className="sr-only"
                    />
                    <span className="text-lg">BOWL</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={updateTossMutation.isPending}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg transition text-lg"
              >
                {updateTossMutation.isPending ? "Updating..." : "Update Toss"}
              </button>
            </form>
          </div>
        )}

        {/* Innings Tab */}
        {activeTab === "innings" && (
          <div className="p-8 space-y-8">
            {/* Create Innings */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Create New Innings</h3>
              <form onSubmit={handleCreateInning} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Batting Team
                    </label>
                    <select
                      value={inningForm.batting_team}
                      onChange={(e) => setInningForm({ ...inningForm, batting_team: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Team</option>
                      {teams.map((team) => (
                        <option key={team._id} value={team._id}>
                          {team.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Innings Number
                    </label>
                    <select
                      value={inningForm.inning_number}
                      onChange={(e) => setInningForm({ ...inningForm, inning_number: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="1">1st Innings</option>
                      <option value="2">2nd Innings</option>
                      <option value="3">3rd Innings</option>
                      <option value="4">4th Innings</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={createInningMutation.isPending}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
                >
                  {createInningMutation.isPending ? "Creating..." : "Create Innings"}
                </button>
              </form>
            </div>

            {/* View Innings */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Innings List</h3>
              {loadingInnings ? (
                <Loading />
              ) : innings.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No innings created yet</p>
              ) : (
                <div className="space-y-3">
                  {innings.map((inning) => (
                    <div
                      key={inning._id}
                      className="flex justify-between items-center bg-gray-50 border border-gray-100 p-4 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-lg text-gray-800">
                          {inning.batting_team?.name} - Innings {inning.inning_number}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          {inning.is_completed && (
                            <span className="ml-2 text-green-600 font-semibold">(Completed)</span>
                          )}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {!inning.is_completed && (
                          <>
                            <button
                              onClick={() => handleCompleteInning(inning._id)}
                              className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg transition"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleDeleteInning(inning._id)}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Deliveries Tab */}
        {activeTab === "deliveries" && (
          <div className="p-8 space-y-8">
            {/* Select Innings */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Active Innings
              </label>
              <select
                value={selectedInningId}
                onChange={(e) => setSelectedInningId(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Innings</option>
                {innings.filter((i) => !i.is_completed).map((inning) => (
                  <option key={inning._id} value={inning._id}>
                    {inning.batting_team?.name} - Innings {inning.inning_number} ({inning.total_runs || 0}/
                    {inning.wickets || 0})
                  </option>
                ))}
              </select>
            </div>

            {selectedInningId && (
              <>
                {/* Match Format Selection */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Match Format
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {["T20", "ODI", "Test", "Custom"].map((format) => (
                      <label
                        key={format}
                        className={`flex items-center justify-center p-3 rounded-lg border-2 cursor-pointer transition ${
                          matchFormat === format
                            ? "border-blue-600 bg-blue-600 text-white font-bold"
                            : "border-gray-300 bg-white hover:border-blue-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="format"
                          value={format}
                          checked={matchFormat === format}
                          onChange={(e) => setMatchFormat(e.target.value)}
                          className="sr-only"
                        />
                        <span>{format}</span>
                      </label>
                    ))}
                    {matchFormat === "Custom" && (
                      <input
                        type="number"
                        value={customOvers}
                        onChange={(e) => setCustomOvers(Number(e.target.value))}
                        className="px-4 py-2 border-2 border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="1"
                        max="200"
                        placeholder="Overs"
                      />
                    )}
                  </div>
                </div>

                {/* Record Delivery Form */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Record Delivery</h3>
                  
                  {/* Current Batsmen Display */}
                  {(currentStriker || currentNonStriker) && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-4 mb-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                            ON STRIKE
                          </div>
                          <span className="font-bold text-gray-800">
                            {players.find(p => p._id === (currentStriker || deliveryForm.batter))?.name || "Select Batter"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                            NON-STRIKER
                          </div>
                          <span className="font-bold text-gray-800">
                            {players.find(p => p._id === (currentNonStriker || deliveryForm.non_striker))?.name || "Select Non-striker"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <form onSubmit={handleRecordDelivery} className="space-y-6">
                    {/* Over and Ball */}
                    <div className="space-y-4">
                      {/* Over Selection */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Select Over (1-{totalOvers})
                        </label>
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-lg">
                          {Array.from({ length: totalOvers }, (_, i) => i + 1).map((over) => (
                            <label
                              key={over}
                              className={`flex items-center justify-center p-2 rounded-lg border-2 cursor-pointer transition ${
                                deliveryForm.over === String(over)
                                  ? "border-green-600 bg-green-600 text-white font-bold"
                                  : "border-gray-300 bg-white hover:border-green-400"
                              }`}
                            >
                              <input
                                type="radio"
                                name="over"
                                value={over}
                                checked={deliveryForm.over === String(over)}
                                onChange={(e) => setDeliveryForm({ ...deliveryForm, over: e.target.value })}
                                className="sr-only"
                                required
                              />
                              <span>{over}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Ball Selection */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Select Ball (1-6)
                        </label>
                        <div className="grid grid-cols-6 gap-3">
                          {[1, 2, 3, 4, 5, 6].map((ball) => (
                            <label
                              key={ball}
                              className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition ${
                                deliveryForm.ball === String(ball)
                                  ? "border-green-600 bg-green-600 text-white font-bold text-lg"
                                  : "border-gray-300 bg-white hover:border-green-400"
                              }`}
                            >
                              <input
                                type="radio"
                                name="ball"
                                value={ball}
                                checked={deliveryForm.ball === String(ball)}
                                onChange={(e) => setDeliveryForm({ ...deliveryForm, ball: e.target.value })}
                                className="sr-only"
                                required
                              />
                              <span>{ball}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Batters and Bowler */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Batter (On Strike)</label>
                        <select
                          value={deliveryForm.batter}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, batter: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                          required
                        >
                          <option value="">Select</option>
                          {getTeamPlayers(
                            innings.find((i) => i._id === selectedInningId)?.batting_team?._id
                          ).map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Non-striker</label>
                        <select
                          value={deliveryForm.non_striker}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, non_striker: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                          required
                        >
                          <option value="">Select</option>
                          {getTeamPlayers(
                            innings.find((i) => i._id === selectedInningId)?.batting_team?._id
                          ).map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Bowler</label>
                        <select
                          value={deliveryForm.bowler}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, bowler: e.target.value })}
                          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                          required
                        >
                          <option value="">Select</option>
                          {getTeamPlayers(
                            // Bowling team is the opposite of batting team
                            selectedMatch.team_1?._id === innings.find((i) => i._id === selectedInningId)?.batting_team?._id
                              ? selectedMatch.team_2?._id
                              : selectedMatch.team_1?._id
                          ).map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Runs */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Runs Scored</label>
                      <div className="flex gap-2">
                        {[0, 1, 2, 3, 4, 6].map((run) => (
                          <button
                            key={run}
                            type="button"
                            onClick={() =>
                              setDeliveryForm({
                                ...deliveryForm,
                                runs: String(run),
                                is_boundary: run === 4,
                                is_six: run === 6,
                              })
                            }
                            className={`flex-1 py-3 rounded-lg font-bold transition ${
                              deliveryForm.runs === String(run)
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                          >
                            {run}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Extras and Wicket */}
                    <div className="grid grid-cols-3 gap-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={deliveryForm.is_wide}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, is_wide: e.target.checked })}
                          className="w-5 h-5 text-green-600"
                        />
                        <span className="font-semibold">Wide</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={deliveryForm.is_no_ball}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, is_no_ball: e.target.checked })}
                          className="w-5 h-5 text-green-600"
                        />
                        <span className="font-semibold">No Ball</span>
                      </label>

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={deliveryForm.is_wicket}
                          onChange={(e) => setDeliveryForm({ ...deliveryForm, is_wicket: e.target.checked })}
                          className="w-5 h-5 text-red-600"
                        />
                        <span className="font-semibold text-red-600">Wicket</span>
                      </label>
                    </div>

                    {/* Wicket Details */}
                    {deliveryForm.is_wicket && (
                      <div className="grid md:grid-cols-2 gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Wicket Type
                          </label>
                          <select
                            value={deliveryForm.wicket_type}
                            onChange={(e) => setDeliveryForm({ ...deliveryForm, wicket_type: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                            required
                          >
                            <option value="">Select Type</option>
                            <option value="bowled">Bowled</option>
                            <option value="caught">Caught</option>
                            <option value="lbw">LBW</option>
                            <option value="run_out">Run Out</option>
                            <option value="stumped">Stumped</option>
                            <option value="hit_wicket">Hit Wicket</option>
                          </select>
                        </div>

                        {(deliveryForm.wicket_type === "caught" ||
                          deliveryForm.wicket_type === "run_out" ||
                          deliveryForm.wicket_type === "stumped") && (
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Fielder</label>
                            <select
                              value={deliveryForm.fielder}
                              onChange={(e) => setDeliveryForm({ ...deliveryForm, fielder: e.target.value })}
                              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                            >
                              <option value="">Select Fielder</option>
                              {players.map((p) => (
                                <option key={p._id} value={p._id}>
                                  {p.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={createDeliveryMutation.isPending}
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition"
                    >
                      {createDeliveryMutation.isPending ? "Recording..." : "Record Delivery"}
                    </button>
                  </form>
                </div>

                {/* Recent Deliveries */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Deliveries</h3>
                  {loadingDeliveries ? (
                    <Loading />
                  ) : deliveries.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No deliveries recorded yet</p>
                  ) : (
                    <div className="space-y-2">
                      {deliveries
                        .slice(-10)
                        .reverse()
                        .map((delivery) => (
                          <div
                            key={delivery._id}
                            className="flex justify-between items-center bg-gray-50 border border-gray-100 p-3 rounded-lg"
                          >
                            <div className="flex items-center gap-4">
                              <span className="font-bold text-gray-700">
                                {delivery.over}.{delivery.ball_number}
                              </span>
                              <span className="text-gray-600">
                                {delivery.batter?.name} • {delivery.bowler?.name}
                              </span>
                              <span
                                className={`font-bold ${
                                  delivery.wicket ? "text-red-600" : "text-green-600"
                                }`}
                              >
                                {delivery.wicket ? "W" : delivery.runs?.total || delivery.runs?.batter || 0}
                                {delivery.runs?.batter === 4 && " (4)"}
                                {delivery.runs?.batter === 6 && " (6)"}
                                {delivery.runs?.extras > 0 && ` +${delivery.runs.extras}`}
                              </span>
                            </div>

                            <button
                              onClick={() => handleDeleteDelivery(delivery._id)}
                              className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg transition text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageMatch;
