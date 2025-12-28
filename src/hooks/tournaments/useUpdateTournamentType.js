import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

const updateTournamentType = async ({ id, data }) => {
  const response = await axios.patch(`/tournament-types/${id}`, data);
  return response.data;
};

export const useUpdateTournamentType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTournamentType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournamentTypes"] });
      queryClient.invalidateQueries({ queryKey: ["tournamentType"] });
    },
  });
};
