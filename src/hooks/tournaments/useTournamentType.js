import { useQuery } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const getTournamentTypeById = async (id) => {
  const { data } = await axios.get(`/tournament-types/${id}`);
  return data;
};

export const useTournamentType = (id) => {
  return useQuery({
    queryKey: ["tournamentType", id],
    queryFn: () => getTournamentTypeById(id),
    enabled: !!id,
  });
};
