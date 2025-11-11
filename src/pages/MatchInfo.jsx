import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getMatchTypeById } from "./../api/api";
import Loading from "../components/Loading";
import Header from "../components/Header";

const MatchInfo = () => {
  const { id } = useParams();

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["match-type", id],
    queryFn: () => getMatchTypeById(id),
    enabled: !!id,
  });

  const formatData = response?.data;

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 text-2xl font-semibold">
          {error?.response?.data?.message || "Format not found"}
        </p>
      </div>
    );
  if (!formatData)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600 text-xl">Match Type not found.</p>
      </div>
    );

  // Dynamic accent color based on format
  const accentColor =
    {
      T20: "border-blue-500 text-blue-600 bg-blue-50",
      ODI: "border-indigo-500 text-indigo-600 bg-indigo-50",
      Test: "border-red-600 text-red-700 bg-red-50",
    }[formatData.name] || "border-gray-500 text-gray-600 bg-gray-50";

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-gray-200">
            {/* Hero Section */}
            <div
              className={`h-80 bg-gradient-to-r ${
                accentColor.split(" ")[0]
              } relative`}
            >
              <div className="absolute inset-0 bg-white/40 backdrop-blur-sm" />
              <div className="absolute bottom-10 left-10 right-10">
                <h1 className="text-8xl font-extrabold text-gray-900 drop-shadow-lg">
                  {formatData.name}
                </h1>
                <p className="text-3xl mt-4 text-gray-800 font-medium">
                  {formatData.description}
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
                <div
                  className={`text-center rounded-3xl p-10 border-4 ${accentColor}`}
                >
                  <p className="text-2xl font-bold opacity-80">Total Overs</p>
                  <p className="text-8xl font-extrabold mt-4">
                    {formatData.total_overs}
                  </p>
                </div>
                <div
                  className={`text-center rounded-3xl p-10 border-4 ${accentColor
                    .replace("bg-", "bg-")
                    .replace("text-", "text-")
                    .replace("border-", "border-")}`}
                >
                  <p className="text-2xl font-bold opacity-80">
                    Powerplay Overs
                  </p>
                  <p className="text-8xl font-extrabold mt-4">
                    {formatData.power_play_overs}
                  </p>
                </div>
                <div
                  className={`text-center rounded-3xl p-10 border-4 ${accentColor}`}
                >
                  <p className="text-2xl font-bold opacity-80">
                    Balls per Over
                  </p>
                  <p className="text-8xl font-extrabold mt-4">
                    {formatData.balls_per_over}
                  </p>
                </div>
              </div>

              {/* Rules Section */}
              <div className="bg-gray-50 rounded-3xl p-10 border-2 border-gray-200">
                <h3 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                  Format Rules
                </h3>
                <ul className="space-y-6 text-lg text-gray-700 max-w-3xl mx-auto">
                  <li className="flex items-start gap-4">
                    <span className="text-4xl text-gray-500">•</span>
                    <span>
                      Each team plays{" "}
                      <strong className="text-gray-900">
                        {formatData.total_overs} overs
                      </strong>
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-4xl text-gray-500">•</span>
                    <span>
                      Powerplay: First{" "}
                      <strong className="text-gray-900">
                        {formatData.power_play_overs} overs
                      </strong>{" "}
                      – only 2 fielders outside 30-yard circle
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-4xl text-gray-500">•</span>
                    <span>
                      Standard{" "}
                      <strong className="text-gray-900">
                        {formatData.balls_per_over} legal deliveries
                      </strong>{" "}
                      per over
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="text-4xl text-gray-500">•</span>
                    <span className="font-semibold text-gray-800">
                      {formatData.name === "T20" &&
                        "Fastest format – 3 hours of non-stop action"}
                      {formatData.name === "ODI" &&
                        "Classic 50-over battle – Full day of cricket"}
                      {formatData.name === "Test" &&
                        "The ultimate test of skill, stamina & strategy over 5 days"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MatchInfo;
