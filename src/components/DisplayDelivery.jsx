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
      <h2>Deliveries:</h2>
      {/* Map */}
      {matchDeliveries.map((delivery) => {
        const overNumber = delivery.over;
        const ballsInThisOver = matchDeliveries
          .filter((d) => d.over === overNumber)
          .sort((a, b) => a.ball_number - b.ball_number);

        return (
          <div
            key={delivery._id}
            className="delivery-parent border m-2 p-2 flex flex-col justify-around"
          >
            <div className="font-bold text-lg mb-2">Over {overNumber + 1}</div>

            <div className="flex gap-10 justify-between p-3">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5, 6].map((ballNum) => {
                  const ball = ballsInThisOver.find(
                    (b) => b.ball_number === ballNum
                  );

                  if (!ball) {
                    return (
                      <span
                        key={ballNum}
                        className="border m-1 p-2 w-10 text-center text-gray-400"
                      >
                        –
                      </span>
                    );
                  }

                  const isWicket = ball.is_wicket;
                  const runs = ball.runs.batter;
                  const extras = ball.runs.extras;
                  const total = ball.runs.total;

                  return (
                    <span
                      key={ballNum}
                      className={`border m-1 p-2 w-10 text-center font-bold ${
                        isWicket
                          ? "bg-red-600 text-white"
                          : runs === 4
                          ? "bg-green-600 text-white"
                          : runs === 6
                          ? "bg-purple-600 text-white"
                          : runs > 0
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      {isWicket ? "W" : total > 0 ? total : "•"}
                    </span>
                  );
                })}
              </div>

              <div className="font-bold">{delivery.bowler}</div>
            </div>

            <div className="flex gap-10 justify-between p-3 text-sm">
              <div>
                <span>🏏</span>
                {delivery.batter}{" "}
                {delivery.runs.batter > 0 && `(${delivery.runs.batter})`}
              </div>
              <div className="text-gray-600">{delivery.non_striker}</div>
            </div>

            {delivery.is_wicket && (
              <div className="bg-red-100 text-red-800 p-2 rounded font-bold text-center">
                WICKET! {delivery.wickets[0].player_out} -{" "}
                {delivery.wickets[0].kind.toUpperCase()}
              </div>
            )}

            <p className="text-xs italic text-gray-600 mt-1">
              {delivery.summary}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default DisplayDelivery;
