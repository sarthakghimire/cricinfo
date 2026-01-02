import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

const updateInningScore = async ({ id, scoreData }) => {
  const { data } = await axios.patch(`/innings/${id}/score`, scoreData);
  return data;
};

export const useUpdateInningScore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInningScore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["innings"] });
    },
  });
};
