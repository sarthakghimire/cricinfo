import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";
import toast from "react-hot-toast";

export const useUpdateMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ matchId, data }) => {
      const response = await axios.patch(`/matches/${matchId}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["match"] });
      toast.success("Match updated successfully!");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update match");
    },
  });
};
