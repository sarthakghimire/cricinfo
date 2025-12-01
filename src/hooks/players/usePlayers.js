import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

const getPlayers = async (page = 1, limit = 100) => {
  const { data } = await axios.get(`/players?page=${page}&limit=${limit}`);
  return data;
};

export const usePlayers = (page = 1, limit = 100) => {
  return useQuery({
    queryKey: ["players", page, limit],
    queryFn: () => getPlayers(page, limit),
    keepPreviousData: true,
  });
};
