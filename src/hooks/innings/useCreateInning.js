import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

const createInning = async (inningData) => {
  const { data } = await axios.post("/innings", inningData);
  return data;
};

export const useCreateInning = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInning,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["innings"] });
    },
  });
};
