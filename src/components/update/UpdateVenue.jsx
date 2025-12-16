import { useState, useEffect } from "react";
import Loading from "../animation/Loading";
import toast from "react-hot-toast";
import { useVenues } from "../../hooks/venues/useVenues";
import { useVenue } from "../../hooks/venues/useVenue";
import { useUpdateVenue } from "../../hooks/venues/useUpdateVenue";

const UpdateVenue = () => {
  const [selectedVenueId, setSelectedVenueId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    capacity: "",
  });

  // Fetch all venues
  const { data: response, isLoading: loadingVenues } = useVenues(1, 100);
  const venues = response?.data || [];

  // Fetch single venue
  const { data: venue, isLoading: loadingOne } = useVenue(selectedVenueId);

  // Auto-fill form when venue loads
  useEffect(() => {
    if (venue) {
      setFormData({
        name: venue.name || "",
        address: venue.address || "",
        capacity: venue.capacity ? String(venue.capacity) : "",
      });
    }
  }, [venue]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const mutation = useUpdateVenue();

  const handleSubmit = (e) => {
    e.preventDefault();

    const updates = {};

    if (formData.name.trim() !== venue?.name) {
      updates.name = formData.name.trim();
    }
    if (formData.address !== venue?.address) {
      updates.address = formData.address.trim() || undefined;
    }
    if (Number(formData.capacity || 0) !== (venue?.capacity || 0)) {
      updates.capacity = Number(formData.capacity);
    }

    if (Object.keys(updates).length === 0) {
      return toast("No changes to save", { icon: "Info" });
    }

    mutation.mutate(
      { id: selectedVenueId, data: updates },
      {
        onSuccess: () => {
          toast.success(`${venue.name} updated successfully!`);
        },
      }
    );
  };

  if (loadingVenues) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Venue Selection */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          Select Venue to Update
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
          {venues.map((v) => (
            <label
              key={v._id}
              className={`flex items-center space-x-3 cursor-pointer p-4 rounded-lg border transition-all ${
                selectedVenueId === v._id
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                  : "border-gray-200 hover:bg-gray-50 hover:border-blue-400"
              }`}
            >
              <input
                type="radio"
                name="venue"
                value={v._id}
                checked={selectedVenueId === v._id}
                onChange={(e) => setSelectedVenueId(e.target.value)}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 truncate">
                  {v.name}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {v.address || "No Address"}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Edit Form */}
      {selectedVenueId && venue && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Update Venue Details</h2>
          
          {loadingOne ? (
            <div className="text-center py-8"><Loading /></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Venue Name
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
                  Address
                </label>
                <input
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Capacity
                </label>
                <input
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {mutation.isPending ? "Updating..." : "Update Venue"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default UpdateVenue;
