import { useQuery } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const getTournaments = async () => {
  const { data } = await axios.get("/tournaments");
  return data;
};

export const useTournaments = () => {
  return useQuery({
    queryKey: ["tournaments"],
    queryFn: getTournaments,
  });
};
