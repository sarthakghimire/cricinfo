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
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      <h2 className="text-4xl font-extrabold text-center bg-linear-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
        Update Venue
      </h2>

      {/* Venue Selection */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-semibold mb-6 text-gray-800">
          Select Venue to Edit
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
          {venues.map((v) => (
            <label
              key={v._id}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-4 rounded-lg border transition hover:border-blue-300"
            >
              <input
                type="radio"
                name="venue"
                value={v._id}
                checked={selectedVenueId === v._id}
                onChange={(e) => setSelectedVenueId(e.target.value)}
                className="w-5 h-5 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-800 truncate">
                  {v.name}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Edit Form */}
      {selectedVenueId && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          {loadingOne ? (
            <div className="text-center py-12">
              <Loading />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <h3 className="text-2xl font-bold text-center text-gray-800">
                Editing: <span className="text-blue-600">{venue?.name}</span>
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Venue Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition text-lg"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Address (Optional)
                  </label>
                  <input
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. Kirtipur, Kathmandu"
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Capacity (seats)
                  </label>
                  <input
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    placeholder="e.g. 30000"
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 text-lg"
                    required
                  />
                </div>
              </div>

              <div className="text-center pt-6">
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full bg-linear-to-r from-blue-600 to-indigo-700 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
                >
                  {mutation.isPending ? "Saving Changes..." : "Update Venue"}
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
