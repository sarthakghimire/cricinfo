import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const createMatchType = async (typeData) => {
  const { data } = await axios.post("/match-types", typeData);
  return data;
};

export const useCreateMatchType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMatchType,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["matchTypes"] }),
  });
};
