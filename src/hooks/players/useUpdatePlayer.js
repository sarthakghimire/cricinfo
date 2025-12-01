import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

const updatePlayer = async ({ id, data }) => {
  const { data: response } = await axios.patch(`/players/${id}`, data);
  return response;
};

export const useUpdatePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePlayer,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["player", id] });
      queryClient.invalidateQueries({ queryKey: ["players"] });
    },
  });
};
