import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

export const useInning = (id) => {
  return useQuery({
    queryKey: ["inning", id],
    queryFn: async () => {
      const { data } = await axios.get(`/innings/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};
