import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

export const useTournamentTypes = () => {
  return useQuery({
    queryKey: ["tournamentTypes"],
    queryFn: async () => {
      const { data } = await axios.get("/tournament-types");
      return data;
    },
  });
};
