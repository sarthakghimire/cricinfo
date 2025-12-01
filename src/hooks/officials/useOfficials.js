import { useQuery } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const getOfficials = async () => {
  const { data } = await axios.get("/officials");
  return data;
};

export const useOfficials = () => {
  return useQuery({
    queryKey: ["officials"],
    queryFn: getOfficials,
  });
};
