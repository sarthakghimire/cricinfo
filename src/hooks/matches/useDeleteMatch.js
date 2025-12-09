import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";
import toast from "react-hot-toast";

export const useDeleteMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (matchId) => {
      const { data } = await axios.delete(`/matches/${matchId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      toast.success("Match deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete match");
    },
  });
};
