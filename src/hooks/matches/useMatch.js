import { useQuery } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const getMatchById = async (id) => {
  const { data } = await axios.get(`/matches/${id}`);
  return data;
};

export const useMatch = (id) => {
  return useQuery({
    queryKey: ["match", id],
    queryFn: () => getMatchById(id),
    enabled: !!id,
  });
};
