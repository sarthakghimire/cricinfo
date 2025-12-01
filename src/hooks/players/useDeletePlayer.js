import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

const deletePlayer = async (id) => {
  const { data } = await axios.delete(`/players/${id}`);
  return data;
};

export const useDeletePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePlayer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["players"] }),
  });
};
