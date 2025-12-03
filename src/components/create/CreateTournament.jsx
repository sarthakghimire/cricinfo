import { useState } from "react";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useOfficials } from "../../hooks/officials/useOfficials";
import { useMatchTypes } from "../../hooks/matchTypes/useMatchTypes";
import { useTournamentTypes } from "../../hooks/tournaments/useTournamentTypes";
import { useCreateTournament } from "../../hooks/tournaments/useCreateTournament";

const CreateTournament = () => {
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
    match_type: "",
    tournament_type: "",
    officials: [],
  });

  const { data: officialsRes, isLoading: loadingOfficials } = useOfficials();
  const { data: matchTypesData, isLoading: loadingMT } = useMatchTypes();
  const { data: tournamentTypesData, isLoading: loadingTT } =
    useTournamentTypes();

  const officials = officialsRes?.data || [];
  const matchTypes = matchTypesData?.data || [];
  const tournamentTypes = tournamentTypesData?.data || [];

  const mutation = useCreateTournament();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOfficialChange = (e) => {
    const id = e.target.value;
    setFormData((prev) => ({
      ...prev,
      officials: e.target.checked
        ? [...prev.officials, id]
        : prev.officials.filter((o) => o !== id),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.match_type || !formData.tournament_type) {
      toast.error("Please select Match Type and Tournament Type");
      return;
    }

    const payload = {
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
      match_type: formData.match_type,
      tournament_type: formData.tournament_type,
      officials: formData.officials,
    };

    mutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Tournament created successfully!");
        setFormData({
          name: "",
          description: "",
          season: "",
          total_overs: "",
          locations: "",
          logo: "",
          banner_image: "",
          match_type: "",
          tournament_type: "",
          officials: [],
        });
      },
      onError: (err) => {
        toast.error(
          err.response?.data?.message || "Failed to create tournament"
        );
      },
    });
  };

  if (loadingOfficials || loadingMT || loadingTT) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Create New Tournament
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl p-10 space-y-8"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-lg font-semibold mb-3">Logo URL</label>
            <input
              type="url"
              name="logo"
              placeholder="https://example.com/logo.png"
              value={formData.logo}
              onChange={handleChange}
              className="w-full px-5 py-4 border-2 rounded-xl focus:border-green-500"
            />
            {formData.logo && (
              <img
                src={formData.logo}
                alt="Logo preview"
                className="mt-4 h-32 mx-auto rounded-lg shadow"
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
              placeholder="https://example.com/banner.jpg"
              value={formData.banner_image}
              onChange={handleChange}
              className="w-full px-5 py-4 border-2 rounded-xl focus:border-green-500"
            />
            {formData.banner_image && (
              <img
                src={formData.banner_image}
                alt="Banner preview"
                className="mt-4 w-full h-48 object-cover rounded-lg shadow"
                onError={(e) => (e.target.style.display = "none")}
              />
            )}
          </div>
        </div>

        {/* Basic Info */}
        <input
          name="name"
          type="text"
          placeholder="Tournament Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-5 py-4 border-2 rounded-xl text-lg"
        />
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-5 py-4 border-2 rounded-xl"
        />
        <input
          name="season"
          type="text"
          placeholder="Season (e.g. 2025)"
          value={formData.season}
          onChange={handleChange}
          required
          className="w-full px-5 py-4 border-2 rounded-xl"
        />

        <div className="grid md:grid-cols-2 gap-6">
          <input
            name="total_overs"
            type="number"
            placeholder="Total Overs"
            value={formData.total_overs}
            onChange={handleChange}
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
          placeholder="Locations (e.g. Kathmandu, Pokhara)"
          value={formData.locations}
          onChange={handleChange}
          className="w-full px-5 py-4 border-2 rounded-xl"
        />

        {/* Match & Tournament Type */}
        <div className="grid md:grid-cols-2 gap-6">
          <select
            name="match_type"
            value={formData.match_type}
            onChange={handleChange}
            required
            className="w-full px-5 py-4 border-2 rounded-xl"
          >
            <option value="">-- Select Match Type --</option>
            {matchTypes.map((mt) => (
              <option key={mt._id} value={mt._id}>
                {mt.name}
              </option>
            ))}
          </select>
          <select
            name="tournament_type"
            value={formData.tournament_type}
            onChange={handleChange}
            required
            className="w-full px-5 py-4 border-2 rounded-xl"
          >
            <option value="">-- Select Tournament Type --</option>
            {tournamentTypes.map((tt) => (
              <option key={tt._id} value={tt._id}>
                {tt.name}
              </option>
            ))}
          </select>
        </div>

        {/* Officials */}
        <div>
          <label className="block text-lg font-semibold mb-4">
            Assign Officials
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto p-4 bg-gray-50 rounded-xl">
            {officials.map((official) => (
              <label
                key={official._id}
                className="flex items-center space-x-3 p-4 bg-white rounded-lg cursor-pointer hover:shadow-md transition"
              >
                <input
                  type="checkbox"
                  value={official._id}
                  checked={formData.officials.includes(official._id)}
                  onChange={handleOfficialChange}
                  className="w-5 h-5 text-green-600 rounded"
                />
                <div>
                  <p className="font-medium">{official.name}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {official.type}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg transition transform hover:scale-105 disabled:scale-100"
        >
          {mutation.isPending ? "Creating Tournament..." : "Create Tournament"}
        </button>
      </form>
    </div>
  );
};

export default CreateTournament;
