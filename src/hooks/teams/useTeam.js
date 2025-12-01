import { useQuery } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const getTeamById = async (id) => {
  const { data } = await axios.get(`/teams/${id}`);
  return data.data;
};

export const useTeam = (id) => {
  return useQuery({
    queryKey: ["team", id],
    queryFn: () => getTeamById(id),
    enabled: !!id,
  });
};
