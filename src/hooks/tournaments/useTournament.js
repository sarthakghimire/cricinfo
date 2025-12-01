import { useQuery } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const getTournamentById = async (id) => {
  const { data } = await axios.get(`/tournaments/${id}`);
  return data;
};

export const useTournament = (id) => {
  return useQuery({
    queryKey: ["tournament", id],
    queryFn: () => getTournamentById(id),
    enabled: !!id,
  });
};
