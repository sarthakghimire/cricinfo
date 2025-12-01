import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const createOfficial = async (officialData) => {
  const { data } = await axios.post("/officials", officialData);
  return data;
};

export const useCreateOfficial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOfficial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["officials"] });
    },
  });
};
