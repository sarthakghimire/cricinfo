import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const deleteMatchType = async (id) => {
  const { data } = await axios.delete(`/match-types/${id}`);
  return data;
};

export const useDeleteMatchType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMatchType,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["matchTypes"] }),
  });
};
