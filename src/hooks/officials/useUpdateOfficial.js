import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";
import toast from "react-hot-toast";

const updateOfficial = async ({ id, data }) => {
  const response = await axios.patch(`/officials/${id}`, data);
  return response.data;
};

export const useUpdateOfficial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOfficial,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["officials"] });
      queryClient.invalidateQueries({ queryKey: ["official", variables.id] });
    },
    onError: (error) => {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update official";
      toast.error(message);
    },
  });
};
