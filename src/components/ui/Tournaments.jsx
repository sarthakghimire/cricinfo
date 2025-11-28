// components/Tournaments.jsx
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTournaments } from "../../api/api";
import { Link } from "react-router-dom";
import Loading from "../animation/Loading";

const Tournaments = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tournaments"],
    queryFn: getTournaments,
  });

  const tournaments = response?.data || [];

  // Auto-slide every 6 seconds
  useEffect(() => {
    if (tournaments.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tournaments.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [tournaments.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? tournaments.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tournaments.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Tournaments
          </h2>
          <div className="h-96 flex items-center justify-center">
            <Loading />
          </div>
        </div>
      </section>
    );
  }

  if (isError || tournaments.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
            Tournaments
          </h2>
          <p className="text-xl text-gray-600">
            {isError
              ? "Failed to load tournaments"
              : "No tournaments available yet"}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
          Tournaments
        </h2>

        <div className="relative max-w-6xl mx-auto">
          {/* Slides Container */}
          <div className="overflow-hidden rounded-3xl shadow-2xl">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {tournaments.map((tournament) => (
                <div key={tournament._id} className="w-full flex-shrink-0">
                  <Link to={`/tournaments/${tournament._id}`}>
                    <div className="relative group cursor-pointer">
                      <img
                        src={tournament.banner_image || "/placeholder.jpg"}
                        alt={tournament.name}
                        className="w-full h-96 md:h-[520px] object-cover"
                      />

                      {/* Dark Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                      {/* Text */}
                      <div className="absolute bottom-0 left-0 right-0 p-10 text-center">
                        <h3 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-2xl">
                          {tournament.name}
                        </h3>
                        <p className="mt-4 text-yellow-400 font-bold text-xl md:text-2xl uppercase tracking-widest">
                          Season {tournament.season}
                        </p>
                      </div>

                      {/* Hover Glow */}
                      <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Left Arrow */}
          {tournaments.length > 1 && (
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white/90 hover:bg-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
            >
              <svg
                className="w-7 h-7 text-blue-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Right Arrow */}
          {tournaments.length > 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-14 h-14 bg-white/90 hover:bg-white rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-110"
            >
              <svg
                className="w-7 h-7 text-blue-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* Dots */}
          {tournaments.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
              {tournaments.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-white scale-125 shadow-lg"
                      : "bg-white/60 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Tournaments;
