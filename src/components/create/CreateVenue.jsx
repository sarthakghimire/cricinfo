import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useCreateVenue } from "../../hooks/venues/useCreateVenue";

const CreateVenue = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    capacity: "",
  });

  const mutation = useCreateVenue();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.address || !formData.capacity) {
      toast.error("All fields are required");
      return;
    }

    mutation.mutate(
      {
        name: formData.name.trim(),
        address: formData.address.trim(),
        capacity: parseInt(formData.capacity),
      },
      {
        onSuccess: () => {
          toast.success("Venue Created Successfully.");
        },
        onError: () => {
          toast.error("Error Creating Venue.");
        },
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Venue</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Venue Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Tribhuvan University Ground"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g. Kirtipur, Kathmandu"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Capacity
          </label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="25000"
            min="100"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-linear-to-r from-blue-600 to-indigo-700 text-white font-bold py-3 rounded-lg hover:from-blue-700 hover:to-indigo-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {mutation.isPending ? "Creating Venue..." : "Create Venue"}
        </button>
      </form>
    </div>
  );
};

export default CreateVenue;
