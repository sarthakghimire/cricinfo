import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { getOfficialById } from "../api/api";
import Loading from "../components/Loading";
import umpireImage from "./../assets/umpire.png";
import Video from "./../assets/umpire.mp4";

const OfficialInfo = () => {
  const { id } = useParams();

  const {
    data: official,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["official", id],
    queryFn: () => getOfficialById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl font-semibold">
            Error loading official
          </p>
          <p className="text-gray-600 mt-2">
            {error?.message || "Something went wrong"}
          </p>
          <Link
            to="/officials"
            className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Officials
          </Link>
        </div>
      </div>
    );
  }

  if (!official) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 text-xl">Official not found</p>
          <Link
            to="/officials"
            className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Officials
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Video Background */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <video
          src={Video}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />

        {/* Official Card */}
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/50">
            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="bg-linear-to-br from-blue-50 to-indigo-100 p-10 flex items-center justify-center">
                <img
                  src={umpireImage}
                  alt={official.name}
                  className="w-64 h-64 object-contain drop-shadow-2xl rounded-full border-8 border-white/80"
                />
              </div>

              {/* Details */}
              <div className="p-10 space-y-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
                    {official.name}
                  </h1>
                  <p className="text-xl font-semibold text-indigo-600 mt-2 capitalize">
                    {official.type.replace(/_/g, " ")}
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-700">About</h2>
                  <p className="text-gray-600 mt-3 leading-relaxed text-lg">
                    {official.description || "No description available."}
                  </p>
                </div>

                <div className="pt-6">
                  <Link
                    to="/"
                    className="inline-flex items-center px-8 py-4 bg-linear-to-r from-blue-600 to-indigo-700 text-white font-bold text-lg rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    Home Page
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialInfo;
