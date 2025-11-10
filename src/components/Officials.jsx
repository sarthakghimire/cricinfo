import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getOfficials } from "./../api/api";
import { Link } from "react-router-dom";
import Loading from "./../components/Loading";
import Video from "./../assets/umpire.mp4";
import umpireImage from "./../assets/umpire.png";

const Officials = () => {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["officials"],
    queryFn: getOfficials,
  });

  const officials = response?.data || [];

  return (
    <section className="py-12 bg-gray-50 overflow-hidden">
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
        Officials
      </h2>

      {/* Video Banner */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative w-full overflow-hidden rounded-2xl shadow-2xl aspect-video">
          {/* Background Video */}
          <video
            src={Video}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Floating Umpire Cards */}
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 max-w-6xl">
              {isLoading ? (
                <Loading />
              ) : (
                officials.slice(0, 12).map((official) => (
                  <Link
                    to={`/officials/${official._id}`}
                    key={official._id}
                    onClick={() => handleOfficialClick(official)}
                    className="group relative bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-110 hover:-translate-y-4 hover:shadow-3xl border border-white/50"
                  >
                    {/* Umpire Image */}
                    <div className="p-4 sm:p-6 flex justify-center">
                      <img
                        src={umpireImage}
                        alt={official.name}
                        className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-2xl"
                      />
                    </div>

                    {/* Name & Role */}
                    <div className="px-3 pb-4 text-center">
                      <h3 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-2 leading-tight">
                        {official.name}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-indigo-600 font-medium capitalize mt-1">
                        {official.type.replace(/_/g, " ")}
                      </p>
                    </div>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {!isLoading && !isError && officials.length > 12 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {officials.slice(12).map((official) => (
              <div
                key={official._id}
                onClick={() => handleOfficialClick(official)}
                className="group bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition"
              >
                <img
                  src={umpireImage}
                  alt=""
                  className="w-full h-40 object-contain p-4"
                />
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-sm">{official.name}</h3>
                  <p className="text-xs text-indigo-600 capitalize">
                    {official.type.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error / Empty States */}
      {isError && (
        <div className="text-center py-20 text-red-600">
          Error: {error?.message || "Failed to load officials"}
        </div>
      )}
      {!isLoading && !isError && officials.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No officials found.
        </div>
      )}
    </section>
  );
};

export default Officials;
