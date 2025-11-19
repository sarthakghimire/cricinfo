import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getDeliveries } from "../api/api";
import Loading from "./Loading";
import { useParams } from "react-router-dom";

const DisplayDelivery = () => {
  const {
    data: response,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["delivery"],
    queryFn: getDeliveries,
  });

  const { id: matchId } = useParams();
  const deliveries = response?.data || [];
  const matchDeliveries = deliveries.filter((d) => d.inning.match === matchId);

  if (isLoading) {
    return <Loading />;
  }
  if (isError) {
    return <p>Error:{error}</p>;
  }
  if (!isLoading && !isError && matchDeliveries.length == 0) {
    return <p>No Deliveries Found</p>;
  }
  return (
    <div>
      <h2 className="text-3xl m-2 p-2">Deliveries:</h2>
      {/* Map */}
      {matchDeliveries
        .sort((a, b) => a.over - b.over || a.ball_number - b.ball_number)
        .map((delivery, index, arr) => {
          const currentOver = delivery.over;
          const currentBall = delivery.ball_number;

          const ballsBowled = arr
            .filter(
              (d) => d.over === currentOver && d.ball_number <= currentBall
            )
            .sort((a, b) => a.ball_number - b.ball_number);

          return (
            <div
              key={delivery._id}
              className="delivery-parent border m-2 p-2 flex flex-col justify-around"
            >
              {/* Over + Current Ball */}
              <div className="font-bold text-lg mb-2 text-blue-700">
                Over {currentOver + 1} • Ball {currentBall}
              </div>

              {/* 6 Ball Display */}
              <div className="flex gap-10 justify-between p-3">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6].map((ballNum) => {
                    const ball = ballsBowled.find(
                      (b) => b.ball_number === ballNum
                    );

                    if (!ball) {
                      return (
                        <span
                          key={ballNum}
                          className="border m-1 p-2 w-10 text-center text-gray-300"
                        >
                          –
                        </span>
                      );
                    }

                    const isCurrentBall = ball.ball_number === currentBall;
                    const isWicket = ball.is_wicket;
                    const runs = ball.runs.total;

                    return (
                      <span
                        key={ballNum}
                        className={`border m-1 p-2 w-10 text-center font-bold transition-all
                          ${
                            isWicket
                              ? "bg-red-600 text-white animate-pulse"
                              : "bg-blue-600 text-white"
                          }
                              `}
                      >
                        {isWicket ? "W" : runs > 0 ? runs : "•"}
                      </span>
                    );
                  })}
                </div>

                <div className="font-bold text-gray-800">{delivery.bowler}</div>
              </div>

              {/* Batsman & Runs */}
              <div className="flex gap-10 justify-between p-3 text-sm">
                <div>
                  <span className="font-semibold">{delivery.batter}</span>
                  {delivery.runs.batter > 0 && (
                    <span className="ml-2 text-green-600 font-bold">
                      +{delivery.runs.batter}
                    </span>
                  )}
                </div>
                <div className="text-gray-600">
                  Non-striker: {delivery.non_striker}
                </div>
              </div>

              {/* Wicket Alert */}
              {delivery.is_wicket && (
                <div className="bg-red-600 text-white p-3 rounded font-bold text-center animate-pulse text-lg">
                  WICKET! {delivery.wickets[0].player_out} —{" "}
                  {delivery.wickets[0].kind.toUpperCase()}
                </div>
              )}

              {/* Commentary */}
              <p className="text-sm italic text-gray-700 mt-2 border-t pt-2">
                {delivery.summary}
              </p>
            </div>
          );
        })}
    </div>
  );
};

export default DisplayDelivery;
