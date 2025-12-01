import { useQuery } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const getOfficialById = async (id) => {
  const { data } = await axios.get(`/officials/${id}`);
  return data.data;
};

export const useOfficial = (id) => {
  return useQuery({
    queryKey: ["official", id],
    queryFn: () => getOfficialById(id),
    enabled: !!id,
  });
};
