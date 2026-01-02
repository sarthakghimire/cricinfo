import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

const fetchMatch = async (matchId) => {
  const { data } = await axios.get(`/matches/${matchId}`);
  return data;
};

export const useMatch = (matchId, options = {}) => {
  return useQuery({
    queryKey: ["match", matchId],
    queryFn: () => fetchMatch(matchId),
    enabled: !!matchId,
    select: (response) => response?.data,
    staleTime: 1000 * 60 * 5,
    ...options, // Spread additional options like refetchInterval
  });
};
