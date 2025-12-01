import React from "react";
import { useParams } from "react-router-dom";
import Loading from "../components/animation/Loading";
import AnimatedCounter from "../components/animation/AnimatedCounter";
import { useVenue } from "../hooks/venues/useVenue";

const VenuePage = () => {
  const { id } = useParams();

  const { data: response, isLoading, isError } = useVenue(id);

  if (isLoading) return <Loading />;
  if (isError || !response?.success)
    return (
      <p className="text-center py-32 text-red-600 text-xl">Venue not found</p>
    );

  const venue = response.data;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96 md:h-[520px] overflow-hidden">
        <img
          src="https://images.augustman.com/wp-content/uploads/sites/4/2023/04/20180002/untitled-design-2023-04-16t071319-214.jpeg"
          alt={venue.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-5xl md:text-7xl font-bold drop-shadow-2xl">
            {venue.name}
          </h1>
          <p className="text-2xl md:text-3xl mt-4 opacity-95">
            {venue.address}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
          <p className="text-gray-600 uppercase tracking-widest text-sm mb-4">
            Seating Capacity
          </p>
          <p className="text-8xl font-extrabold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            <AnimatedCounter
              value={venue.capacity || 0}
              duration={1800}
              className="inline-block"
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default VenuePage;
