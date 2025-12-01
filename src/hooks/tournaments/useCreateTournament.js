import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const createTournament = async (payload) => {
  const { data } = await axios.post("/tournaments", payload);
  return data;
};

export const useCreateTournament = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTournament,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tournaments"] }),
  });
};
