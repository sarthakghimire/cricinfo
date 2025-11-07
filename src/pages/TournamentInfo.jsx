import React from "react";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";
import { getTournamentById } from "../api/api";

const TournamentInfo = () => {
  const {
    data: response,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["tournaments"],
    queryFn: getTournamentById,
  });
  return <div>TournamentInfo</div>;
};

export default TournamentInfo;
