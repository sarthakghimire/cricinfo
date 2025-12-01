import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

const getPlayerById = async (id) => {
  const { data } = await axios.get(`/players/${id}`);
  return data.data;
};

export const usePlayer = (id) => {
  return useQuery({
    queryKey: ["player", id],
    queryFn: () => getPlayerById(id),
    enabled: !!id,
  });
};
