import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

const fetchStages = async (tournamentId) => {
  const { data } = await axios.get(`/stages/tournaments/${tournamentId}`);
  return data;
};

export const useStages = (tournamentId) => {
  return useQuery({
    queryKey: ["stages", tournamentId],
    queryFn: () => fetchStages(tournamentId),
    enabled: !!tournamentId,
    select: (response) => response?.data || [],
  });
};
