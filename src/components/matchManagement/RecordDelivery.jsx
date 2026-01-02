import { useState } from "react";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useInnings } from "../../hooks/innings/useInnings";
import { usePlayers } from "../../hooks/players/usePlayers";
import { useDeliveriesByInning } from "../../hooks/deliveries/useDeliveriesByInning";
import { useCreateDelivery } from "../../hooks/deliveries/useCreateDelivery";
import { useDeleteDelivery } from "../../hooks/deliveries/useDeleteDelivery";

const RecordDelivery = () => {
  const [selectedInningId, setSelectedInningId] = useState("");
  const [formData, setFormData] = useState({
    over: "",
    ball: "",
    batter: "",
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

  const { data: inningsRes, isLoading: loadingInnings } = useInnings();
  const { data: playersRes } = usePlayers(1, 200);
  const { data: deliveriesRes, isLoading: loadingDeliveries } = useDeliveriesByInning(selectedInningId);

  const innings = inningsRes?.data || [];
  const players = playersRes?.data || [];
  const deliveries = deliveriesRes?.data || [];

  const createMutation = useCreateDelivery();
  const deleteMutation = useDeleteDelivery();

  const activeInnings = innings.filter((i) => !i.is_completed);

  const handleSubmit = (e) => {
    e.preventDefault();

    const deliveryData = {
      inning: selectedInningId,
      over: Number(formData.over),
      ball: Number(formData.ball),
      batter: formData.batter,
      bowler: formData.bowler,
      runs: Number(formData.runs),
      is_boundary: formData.is_boundary,
      is_six: formData.is_six,
      is_wide: formData.is_wide,
      is_no_ball: formData.is_no_ball,
      is_wicket: formData.is_wicket,
    };

    if (formData.is_wicket) {
      deliveryData.wicket_type = formData.wicket_type;
      if (formData.fielder) {
        deliveryData.fielder = formData.fielder;
      }
    }

    createMutation.mutate(deliveryData, {
      onSuccess: () => {
        toast.success("Delivery recorded!");
        // Reset form but keep inning, over, and players
        setFormData({
          ...formData,
          ball: String(Number(formData.ball) + 1),
          runs: "0",
          is_boundary: false,
          is_six: false,
          is_wide: false,
          is_no_ball: false,
          is_wicket: false,
          wicket_type: "",
          fielder: "",
        });
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to record delivery");
      },
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this delivery? This will affect the score.")) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success("Delivery deleted"),
        onError: () => toast.error("Failed to delete delivery"),
      });
    }
  };

  if (loadingInnings) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Select Innings */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Record Delivery</h2>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Active Innings
          </label>
          <select
            value={selectedInningId}
            onChange={(e) => setSelectedInningId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Innings</option>
            {activeInnings.map((inning) => (
              <option key={inning._id} value={inning._id}>
                {inning.batting_team?.name} - Innings {inning.inning_number} ({inning.total_runs || 0}/{inning.wickets || 0})
              </option>
            ))}
          </select>
        </div>

        {selectedInningId && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Over and Ball */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Over
                </label>
                <input
                  type="number"
                  value={formData.over}
                  onChange={(e) => setFormData({ ...formData, over: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ball
                </label>
                <input
                  type="number"
                  value={formData.ball}
                  onChange={(e) => setFormData({ ...formData, ball: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="6"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Batter
                </label>
                <select
                  value={formData.batter}
                  onChange={(e) => setFormData({ ...formData, batter: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Batter</option>
                  {players.map((player) => (
                    <option key={player._id} value={player._id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bowler
                </label>
                <select
                  value={formData.bowler}
                  onChange={(e) => setFormData({ ...formData, bowler: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Bowler</option>
                  {players.map((player) => (
                    <option key={player._id} value={player._id}>
                      {player.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Runs */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Runs Scored
              </label>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4, 6].map((run) => (
                  <button
                    key={run}
                    type="button"
                    onClick={() => setFormData({ ...formData, runs: String(run), is_boundary: run === 4, is_six: run === 6 })}
                    className={`flex-1 py-3 rounded-lg font-bold transition ${
                      formData.runs === String(run)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {run}
                  </button>
                ))}
              </div>
            </div>

            {/* Extras and Wicket */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_wide}
                  onChange={(e) => setFormData({ ...formData, is_wide: e.target.checked })}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="font-semibold">Wide</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_no_ball}
                  onChange={(e) => setFormData({ ...formData, is_no_ball: e.target.checked })}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="font-semibold">No Ball</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_wicket}
                  onChange={(e) => setFormData({ ...formData, is_wicket: e.target.checked })}
                  className="w-5 h-5 text-red-600"
                />
                <span className="font-semibold text-red-600">Wicket</span>
              </label>
            </div>

            {/* Wicket Details */}
            {formData.is_wicket && (
              <div className="grid md:grid-cols-2 gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Wicket Type
                  </label>
                  <select
                    value={formData.wicket_type}
                    onChange={(e) => setFormData({ ...formData, wicket_type: e.target.value })}
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

                {(formData.wicket_type === "caught" || formData.wicket_type === "run_out" || formData.wicket_type === "stumped") && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fielder
                    </label>
                    <select
                      value={formData.fielder}
                      onChange={(e) => setFormData({ ...formData, fielder: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select Fielder</option>
                      {players.map((player) => (
                        <option key={player._id} value={player._id}>
                          {player.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition transform hover:scale-105 disabled:scale-100"
            >
              {createMutation.isPending ? "Recording..." : "Record Delivery"}
            </button>
          </form>
        )}
      </div>

      {/* Recent Deliveries */}
      {selectedInningId && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Deliveries</h2>

          {loadingDeliveries ? (
            <Loading />
          ) : deliveries.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No deliveries recorded yet</p>
          ) : (
            <div className="space-y-2">
              {deliveries.slice(-10).reverse().map((delivery) => (
                <div
                  key={delivery._id}
                  className="flex justify-between items-center bg-gray-50 border border-gray-100 p-3 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-gray-700">
                      {delivery.over}.{delivery.ball}
                    </span>
                    <span className="text-gray-600">
                      {delivery.batter?.name} • {delivery.bowler?.name}
                    </span>
                    <span className={`font-bold ${delivery.is_wicket ? "text-red-600" : "text-blue-600"}`}>
                      {delivery.is_wicket ? "W" : delivery.runs}
                      {delivery.is_boundary && " (4)"}
                      {delivery.is_six && " (6)"}
                      {delivery.is_wide && " WD"}
                      {delivery.is_no_ball && " NB"}
                    </span>
                    {delivery.is_wicket && delivery.wicket_type && (
                      <span className="text-red-500 text-sm">
                        ({delivery.wicket_type.replace(/_/g, " ")})
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(delivery._id)}
                    disabled={deleteMutation.isPending}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold px-4 py-2 rounded-lg transition text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecordDelivery;
