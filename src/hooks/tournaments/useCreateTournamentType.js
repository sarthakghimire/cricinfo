import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const createTournamentType = async (typeData) => {
  const { data } = await axios.post("/tournament-types", typeData);
  return data;
};

export const useCreateTournamentType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTournamentType,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tournamentTypes"] }),
  });
};
