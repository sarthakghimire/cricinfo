import { useQuery } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const getMatchTypes = async () => {
  const { data } = await axios.get("/match-types");
  return data;
};

export const useMatchTypes = () => {
  return useQuery({
    queryKey: ["matchTypes"],
    queryFn: getMatchTypes,
  });
};
