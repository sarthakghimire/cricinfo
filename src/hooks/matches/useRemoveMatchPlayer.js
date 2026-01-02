import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

export const useRemoveMatchPlayer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ matchPlayerId, matchId }) => {
      const { data } = await axios.delete(`/matches/players/${matchPlayerId}`);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["matchPlayers", variables.matchId] });
    },
  });
};
