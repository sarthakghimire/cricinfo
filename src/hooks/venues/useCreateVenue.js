import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const createVenue = async (venueData) => {
  const { data } = await axios.post("/venues", venueData);
  return data;
};

export const useCreateVenue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVenue,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venues"] }),
  });
};
