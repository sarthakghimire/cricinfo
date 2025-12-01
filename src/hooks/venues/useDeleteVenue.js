import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const deleteVenue = async (id) => {
  const { data } = await axios.delete(`/venues/${id}`);
  return data;
};

export const useDeleteVenue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVenue,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venues"] }),
  });
};
