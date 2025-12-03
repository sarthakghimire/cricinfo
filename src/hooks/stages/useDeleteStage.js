import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";
import toast from "react-hot-toast";

const deleteStage = async (stageId) => {
  const { data } = await axios.delete(`/stages/${stageId}`);
  return data;
};

export const useDeleteStage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStage,
    onSuccess: (data, stageId) => {
      queryClient.invalidateQueries({ queryKey: ["stages"] });
      queryClient.removeQueries({ queryKey: ["stage", stageId] });
      toast.success("Stage deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete stage");
    },
  });
};
