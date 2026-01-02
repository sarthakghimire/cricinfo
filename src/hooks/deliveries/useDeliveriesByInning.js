import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

export const useDeliveriesByInning = (inningId, options = {}) => {
  return useQuery({
    queryKey: ["deliveries", "inning", inningId],
    queryFn: async () => {
      const { data } = await axios.get(`/deliveries/innings/${inningId}`);
      return data;
    },
    enabled: !!inningId,
    ...options, // Spread additional options like refetchInterval
  });
};
