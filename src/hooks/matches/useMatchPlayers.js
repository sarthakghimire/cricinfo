import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

export const useMatchPlayers = (matchId) => {
  return useQuery({
    queryKey: ["matchPlayers", matchId],
    queryFn: async () => {
      const { data } = await axios.get(`/matches/${matchId}/players`);
      return data;
    },
    enabled: !!matchId,
    select: (response) => response?.data,
  });
};
