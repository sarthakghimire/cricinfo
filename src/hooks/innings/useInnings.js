import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

export const useInnings = () => {
  return useQuery({
    queryKey: ["innings"],
    queryFn: async () => {
      const { data } = await axios.get("/innings");
      return data;
    },
  });
};
