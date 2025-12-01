import { useQuery } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const getMatches = async () => {
  const { data } = await axios.get("/matches");
  return data;
};

export const useMatches = () => {
  return useQuery({
    queryKey: ["matches"],
    queryFn: getMatches,
  });
};
