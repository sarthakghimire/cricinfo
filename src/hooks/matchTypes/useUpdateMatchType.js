import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

const updateMatchType = async ({ id, data }) => {
  const response = await axios.patch(`/match-types/${id}`, data);
  return response.data;
};

export const useUpdateMatchType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMatchType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matchTypes"] });
      queryClient.invalidateQueries({ queryKey: ["matchType"] });
    },
  });
};
