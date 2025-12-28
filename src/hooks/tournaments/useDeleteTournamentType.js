import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const deleteTournamentType = async (id) => {
  const { data } = await axios.delete(`/tournament-types/${id}`);
  return data;
};

export const useDeleteTournamentType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTournamentType,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tournamentTypes"] }),
  });
};
