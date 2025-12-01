import { useQuery } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const getDeliveries = async () => {
  const { data } = await axios.get("/deliveries");
  return data;
};

export const useDeliveries = () => {
  return useQuery({
    queryKey: ["deliveries"],
    queryFn: getDeliveries,
  });
};
