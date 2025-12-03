import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

const updateStage = async ({ stageId, data }) => {
  const response = await axios.patch(`/stages/${stageId}`, data);
  return response.data;
};

export const useUpdateStage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStage,
    onSuccess: (response) => {
      // Refresh the stages list of the tournament
      const tournamentId = response.data?.tournament?._id;
      if (tournamentId) {
        queryClient.invalidateQueries({ queryKey: ["stages", tournamentId] });
      }
    },
  });
};
