import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const createTeam = async (teamData) => {
  const { data } = await axios.post("/teams", teamData);
  return data;
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};
