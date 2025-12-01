import { useQuery } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const getTeams = async () => {
  const { data } = await axios.get("/teams");
  return data;
};

export const useTeams = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: getTeams,
  });
};
