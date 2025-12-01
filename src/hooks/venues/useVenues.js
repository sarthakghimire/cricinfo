import { useQuery } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const getVenues = async () => {
  const { data } = await axios.get("/venues");
  return data;
};

export const useVenues = () => {
  return useQuery({
    queryKey: ["venues"],
    queryFn: getVenues,
  });
};
