import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

const updateInning = async ({ id, data }) => {
  const response = await axios.patch(`/innings/${id}`, data);
  return response.data;
};

export const useUpdateInning = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInning,
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["inning", id] });
      queryClient.invalidateQueries({ queryKey: ["innings"] });
    },
  });
};
