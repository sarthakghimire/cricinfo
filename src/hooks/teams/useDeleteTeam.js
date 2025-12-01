import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const deleteTeam = async (id) => {
  const { data } = await axios.delete(`/teams/${id}`);
  return data;
};

export const useDeleteTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};
