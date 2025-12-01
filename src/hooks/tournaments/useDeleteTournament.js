import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const deleteTournament = async (id) => {
  const { data } = await axios.delete(`/tournaments/${id}`);
  return data;
};

export const useDeleteTournament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTournament,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tournaments"] }),
  });
};
