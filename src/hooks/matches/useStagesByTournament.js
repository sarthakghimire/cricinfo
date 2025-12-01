import { useQuery } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const getStagesByTournament = async (tournamentId) => {
  const { data } = await axios.get(`/stages/tournaments/${tournamentId}`);
  return data;
};

export const useStagesByTournament = (tournamentId) => {
  return useQuery({
    queryKey: ["stages", tournamentId],
    queryFn: () => getStagesByTournament(tournamentId),
    enabled: !!tournamentId,
  });
};
