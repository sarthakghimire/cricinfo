import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const deleteOfficial = async (id) => {
  const { data } = await axios.delete(`/officials/${id}`);
  return data;
};

export const useDeleteOfficial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteOfficial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["officials"] });
    },
  });
};
