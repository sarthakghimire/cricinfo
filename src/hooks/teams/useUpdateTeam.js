import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const updateTeam = async ({ teamId, updates }) => {
  const { data } = await axios.patch(`/teams/${teamId}`, updates, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

export const useUpdateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTeam,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["team", variables.teamId] });
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};
