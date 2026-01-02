import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

const deleteInning = async (id) => {
  const { data } = await axios.delete(`/innings/${id}`);
  return data;
};

export const useDeleteInning = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInning,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["innings"] });
    },
  });
};
