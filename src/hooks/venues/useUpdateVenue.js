import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";
import toast from "react-hot-toast";

const updateVenue = async ({ id, data }) => {
  const response = await axios.patch(`/venues/${id}`, data);
  return response.data;
};

export const useUpdateVenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateVenue,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
      queryClient.invalidateQueries({ queryKey: ["venue", variables.id] });
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to update venue";
      toast.error(message);
    },
  });
};
