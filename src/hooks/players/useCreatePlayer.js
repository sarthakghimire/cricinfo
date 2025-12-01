import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

const createPlayer = async (data) => {
  const { data: response } = await axios.post("/players", data);
  return response;
};

export const useCreatePlayer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPlayer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["players"] }),
  });
};
