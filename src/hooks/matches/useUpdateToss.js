import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

const updateToss = async ({ matchId, tossData }) => {
  const { data } = await axios.patch(`/matches/${matchId}/toss-result`, tossData);
  return data;
};

export const useUpdateToss = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateToss,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["match"] });
    },
  });
};
