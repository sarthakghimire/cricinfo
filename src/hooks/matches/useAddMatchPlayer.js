import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

export const useAddMatchPlayer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ matchId, playerData }) => {
      const { data } = await axios.post(`/matches/${matchId}/players`, playerData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["matchPlayers", variables.matchId] });
    },
  });
};
