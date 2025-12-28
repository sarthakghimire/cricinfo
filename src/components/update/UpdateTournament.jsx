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

    const updates = {};

    // Only include changed fields
    if (formData.name.trim() !== selectedTournament.name)
      updates.name = formData.name.trim();
    if (formData.description.trim() !== (selectedTournament.description || ""))
      updates.description = formData.description.trim() || undefined;
    if (formData.season.trim() !== selectedTournament.season)
      updates.season = formData.season.trim();
    if (Number(formData.total_overs) !== selectedTournament.total_overs)
      updates.total_overs = Number(formData.total_overs);
    if (Number(formData.balls_per_over) !== selectedTournament.balls_per_over)
      updates.balls_per_over = Number(formData.balls_per_over);
    if (formData.gender !== selectedTournament.gender)
      updates.gender = formData.gender;
    
    const newLocations = formData.locations
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);
    const oldLocations = selectedTournament.locations || [];
    if (JSON.stringify(newLocations.sort()) !== JSON.stringify(oldLocations.sort()))
      updates.locations = newLocations;
    
    if (formData.logo.trim() !== (selectedTournament.logo || ""))
      updates.logo = formData.logo.trim() || undefined;
    if (formData.banner_image.trim() !== (selectedTournament.banner_image || ""))
      updates.banner_image = formData.banner_image.trim() || undefined;

    if (Object.keys(updates).length === 0) {
      toast("No changes detected", { icon: "ℹ️" });
      return;
    }

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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Select Tournament Card */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Select Tournament to Update</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-h-96 overflow-y-auto pr-2">
          {tournaments.map((t) => (
            <label
              key={t._id}
              className={`flex items-center space-x-4 p-5 rounded-xl border cursor-pointer transition-all ${
                selectedId === t._id
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                  : "border-gray-200 hover:border-blue-400 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="tournament"
                value={t._id}
                checked={selectedId === t._id}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <p className="font-bold text-gray-800">{t.name}</p>
                <p className="text-sm text-gray-600 italic">Season: {t.season}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Update Form Card */}
      {selectedId && selectedTournament && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Tournament Details</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Logo URL</label>
                <input
                  type="url"
                  name="logo"
                  value={formData.logo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Banner Image URL
                </label>
                <input
                  type="url"
                  name="banner_image"
                  value={formData.banner_image}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Basic Info */}
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-2">Tournament Name</label>
               <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Tournament Name"
                required
              />
            </div>

            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
               <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Description"
              />
            </div>
            
            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-2">Season</label>
               <input
                name="season"
                type="text"
                value={formData.season}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Season (e.g. 2025)"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Overs</label>
                <input
                  name="total_overs"
                  type="number"
                  value={formData.total_overs}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Balls Per Over</label>
                <select
                  name="balls_per_over"
                  value={formData.balls_per_over}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="6">6 balls per over</option>
                  <option value="8">8 balls per over</option>
                </select>
              </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="M">Men's</option>
                  <option value="F">Women's</option>
                  <option value="Mixed">Mixed</option>
                </select>
            </div>

            <div>
               <label className="block text-sm font-semibold text-gray-700 mb-2">Locations</label>
               <input
                name="locations"
                type="text"
                value={formData.locations}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Locations (comma separated)"
              />
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? "Updating..." : "Update Tournament"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UpdateTournament;
