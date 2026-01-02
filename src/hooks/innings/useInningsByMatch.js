import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

export const useInningsByMatch = (matchId, options = {}) => {
  return useQuery({
    queryKey: ["innings", "match", matchId],
    queryFn: async () => {
      const { data } = await axios.get(`/innings/matches/${matchId}`);
      return data;
    },
    enabled: !!matchId,
    ...options, // Spread additional options like refetchInterval
  });
};
