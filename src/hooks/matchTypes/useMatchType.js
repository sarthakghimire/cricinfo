import { useQuery } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const getMatchTypeById = async (id) => {
  const { data } = await axios.get(`/match-types/${id}`);
  return data;
};

export const useMatchType = (id) => {
  return useQuery({
    queryKey: ["matchType", id],
    queryFn: () => getMatchTypeById(id),
    enabled: !!id,
  });
};
