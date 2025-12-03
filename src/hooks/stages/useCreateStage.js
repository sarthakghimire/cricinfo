import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";
import toast from "react-hot-toast";

const createStage = async (stageData) => {
  const { data } = await axios.post("/stages", stageData);
  return data;
};

export const useCreateStage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStage,
    onSuccess: (response) => {
      const tournamentId =
        response.data?.tournament?._id || response.data?.tournament;
      if (tournamentId) {
        queryClient.invalidateQueries({ queryKey: ["stages", tournamentId] });
      }
    },
  });
};
