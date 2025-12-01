import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const updateTournament = async ({ id, data }) => {
  const { data: response } = await axios.patch(`/tournaments/${id}`, data);
  return response;
};

export const useUpdateTournament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTournament,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["tournament", id] });
      queryClient.invalidateQueries({ queryKey: ["tournaments"] });
    },
  });
};
