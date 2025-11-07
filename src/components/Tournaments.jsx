import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTournaments } from "./../api/api";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import Loading from "./../components/Loading";

const Tournaments = () => {
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

  // Custom Arrows (Tailwind only)
  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
    >
      <svg
        className="w-6 h-6 text-blue-700"
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
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
    >
      <svg
        className="w-6 h-6 text-blue-700"
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
  );

  const settings = {
    dots: true,
    infinite: tournaments.length > 1,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots) => (
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <ul className="flex gap-3"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 bg-white/70 rounded-full hover:bg-white transition-all duration-300" />
    ),
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Title */}
      <h2
        className="
        text-3xl sm:text-4xl font-extrabold
        bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700
        bg-clip-text text-transparent
        mb-8 tracking-tight
        max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
        drop-shadow-sm cursor-pointer
      "
      >
        Tournaments
      </h2>

      {/* Slider Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="h-96 flex items-center justify-center">
            <Loading />
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-red-600 text-2xl font-bold">
              Error loading tournaments
            </p>
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-xl">No tournaments available</p>
          </div>
        ) : (
          <Slider {...settings}>
            {tournaments.map((tournament) => (
              <div key={tournament._id} className="px-4">
                <Link to={`/tournaments/${tournament._id}`}>
                  <div className="relative group cursor-pointer overflow-hidden rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                    {/* Banner Image */}
                    <img
                      src={tournament.banner_image}
                      alt={tournament.name}
                      className="w-full h-96 md:h-[500px] object-cover"
                    />

                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                    {/* Tournament Name */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-center">
                      <h3 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-2xl tracking-tight">
                        {tournament.name}
                      </h3>
                      <p className="mt-4 text-yellow-400 font-bold text-lg md:text-xl uppercase tracking-widest">
                        Season {tournament.season}
                      </p>
                    </div>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
};

export default Tournaments;
