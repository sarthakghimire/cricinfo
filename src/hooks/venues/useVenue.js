import { useQuery } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const getVenueById = async (id) => {
  const { data } = await axios.get(`/venues/${id}`);
  return data.data;
};

export const useVenue = (id) => {
  return useQuery({
    queryKey: ["venue", id],
    queryFn: () => getVenueById(id),
    enabled: !!id,
  });
};
