import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const createMatch = async (matchData) => {
  const { data } = await axios.post("/matches", matchData);
  return data;
};

export const useCreateMatch = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMatch,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["matches"] }),
  });
};
