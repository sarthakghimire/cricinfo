import { useState, useEffect } from "react";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useTournaments } from "../../hooks/tournaments/useTournaments";
import { useUpdateTournament } from "../../hooks/tournaments/useUpdateTournament";

const UpdateTournament = () => {
  const [selectedId, setSelectedId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    season: "",
    total_overs: "",
    balls_per_over: "6",
    gender: "M",
    locations: "",
    logo: "",
    banner_image: "",
  });

  const { data: res, isLoading } = useTournaments();
  const tournaments = res?.data || [];

  const selectedTournament = tournaments.find((t) => t._id === selectedId);

  // Auto-fill form when tournament is selected
  useEffect(() => {
    if (selectedTournament) {
      setFormData({
        name: selectedTournament.name || "",
        description: selectedTournament.description || "",
        season: selectedTournament.season || "",
        total_overs: selectedTournament.total_overs?.toString() || "",
        balls_per_over: selectedTournament.balls_per_over?.toString() || "6",
        gender: selectedTournament.gender || "M",
        locations: selectedTournament.locations?.join(", ") || "",
        logo: selectedTournament.logo || "",
        banner_image: selectedTournament.banner_image || "",
      });
    }
  }, [selectedTournament]);

  const mutation = useUpdateTournament();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updates = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      season: formData.season.trim(),
      total_overs: Number(formData.total_overs),
      balls_per_over: Number(formData.balls_per_over),
      gender: formData.gender,
      locations: formData.locations
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean),
      logo: formData.logo.trim() || undefined,
      banner_image: formData.banner_image.trim() || undefined,
    };

    mutation.mutate(
      { id: selectedId, data: updates },
      {
        onSuccess: () => toast.success("Tournament updated successfully!"),
        onError: (err) =>
          toast.error(err.response?.data?.message || "Update failed"),
      }
    );
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h2 className="text-4xl font-extrabold text-center bg-linear-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
        Update Tournament
      </h2>

      {/* SELECT TOURNAMENT */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h3 className="text-xl font-semibold mb-6">Select Tournament</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-h-96 overflow-y-auto">
          {tournaments.map((t) => (
            <label
              key={t._id}
              className={`flex items-center space-x-4 p-6 rounded-xl border-2 cursor-pointer transition-all
                ${
                  selectedId === t._id
                    ? "border-blue-600 bg-blue-50 shadow-lg"
                    : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
                }`}
            >
              <input
                type="radio"
                name="tournament"
                value={t._id}
                checked={selectedId === t._id}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-6 h-6 text-blue-600"
              />
              <div className="flex-1">
                <div className="font-bold text-gray-800">{t.name}</div>
                <div className="text-sm text-gray-600">{t.season}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* EDIT FORM */}
      {selectedId && selectedTournament && (
        <div className="bg-white rounded-2xl shadow-xl p-10">
          <h3 className="text-3xl font-bold text-center mb-10">
            Editing:{" "}
            <span className="text-blue-600">{selectedTournament.name}</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
            {/* Logo & Banner Image URLs */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-semibold mb-3">
                  Logo URL
                </label>
                <input
                  type="url"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-5 py-4 border-2 rounded-xl focus:border-blue-500"
                />
                {formData.logo && (
                  <img
                    src={formData.logo}
                    alt="Logo preview"
                    className="mt-4 h-40 mx-auto rounded-lg shadow-lg object-contain bg-white"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
              </div>

              <div>
                <label className="block text-lg font-semibold mb-3">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  name="banner_image"
                  value={formData.banner_image}
                  onChange={handleChange}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full px-5 py-4 border-2 rounded-xl focus:border-blue-500"
                />
                {formData.banner_image && (
                  <img
                    src={formData.banner_image}
                    alt="Banner preview"
                    className="mt-4 w-full h-64 object-cover rounded-xl shadow-lg"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
              </div>
            </div>

            {/* Basic Fields */}
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Tournament Name"
              required
              className="w-full px-5 py-4 border-2 rounded-xl"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description (optional)"
              rows={4}
              className="w-full px-5 py-4 border-2 rounded-xl"
            />
            <input
              name="season"
              type="text"
              value={formData.season}
              onChange={handleChange}
              placeholder="Season (e.g. 2025)"
              required
              className="w-full px-5 py-4 border-2 rounded-xl"
            />

            <div className="grid md:grid-cols-2 gap-6">
              <input
                name="total_overs"
                type="number"
                value={formData.total_overs}
                onChange={handleChange}
                placeholder="Total Overs"
                required
                className="w-full px-5 py-4 border-2 rounded-xl"
              />
              <select
                name="balls_per_over"
                value={formData.balls_per_over}
                onChange={handleChange}
                className="w-full px-5 py-4 border-2 rounded-xl"
              >
                <option value="6">6 balls per over</option>
                <option value="8">8 balls per over</option>
              </select>
            </div>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-5 py-4 border-2 rounded-xl"
            >
              <option value="M">Men's</option>
              <option value="F">Women's</option>
              <option value="Mixed">Mixed</option>
            </select>

            <input
              name="locations"
              type="text"
              value={formData.locations}
              onChange={handleChange}
              placeholder="Locations (comma separated)"
              className="w-full px-5 py-4 border-2 rounded-xl"
            />

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-700 text-white font-bold py-6 rounded-2xl text-2xl hover:from-blue-700 hover:to-indigo-800 disabled:opacity-60 transition shadow-xl"
            >
              {mutation.isPending ? "Saving Changes..." : "Update Tournament"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateTournament;
