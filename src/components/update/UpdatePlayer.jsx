import React, { useState, useEffect } from "react";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { usePlayers } from "../../hooks/players/usePlayers";
import { usePlayer } from "../../hooks/players/usePlayer";
import { useUpdatePlayer } from "../../hooks/players/useUpdatePlayer";

const UpdatePlayer = () => {
  const [selectedPlayerId, setSelectedPlayerId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    gender: "M",
    date_of_birth: "",
    image: "",
  });

  const { data: playersResponse, isLoading: loadingPlayers } = usePlayers(
    1,
    100
  );
  const players = playersResponse?.data || [];

  const { data: player, isLoading: loadingPlayer } =
    usePlayer(selectedPlayerId);

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name || "",
        gender: player.gender || "M",
        date_of_birth: player.date_of_birth?.slice(0, 10) || "",
        image: player.image || "",
      });
    }
  }, [player]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const mutation = useUpdatePlayer();

  const handleSubmit = (e) => {
    e.preventDefault();

    const updates = {};
    if (formData.name !== player?.name) updates.name = formData.name;
    if (formData.gender !== player?.gender) updates.gender = formData.gender;
    if (formData.date_of_birth !== (player?.date_of_birth?.slice(0, 10) || ""))
      updates.date_of_birth = formData.date_of_birth;
    if (formData.image !== player?.image) updates.image = formData.image;

    if (Object.keys(updates).length === 0) {
      return toast("No changes to save", { icon: "ℹ️" });
    }

    mutation.mutate(
      { id: selectedPlayerId, data: updates },
      {
        onSuccess: () => {
          toast.success(`${player.name} updated successfully!`);
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message || "Failed to update player"
          );
        },
      }
    );
  };

  if (loadingPlayers) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Player Selection */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Select Player to Update
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
          {players.map((p) => (
            <label
              key={p._id}
              className={`flex items-center space-x-3 cursor-pointer p-3 rounded-lg border transition-all ${
                selectedPlayerId === p._id
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                  : "border-gray-200 hover:bg-gray-50 hover:border-blue-400"
              }`}
            >
              <input
                type="radio"
                name="player"
                value={p._id}
                checked={selectedPlayerId === p._id}
                onChange={(e) => setSelectedPlayerId(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-gray-800 font-medium truncate">
                {p.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Edit Form */}
      {selectedPlayerId && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          {loadingPlayer ? (
            <div className="text-center py-12">
              <Loading />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Update Player Details
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    name="image"
                    type="url"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/player.jpg"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <input
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
              </div>

              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? "Updating..." : "Update Player"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default UpdatePlayer;
