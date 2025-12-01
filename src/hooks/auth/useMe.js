import { useQuery } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const getMe = async () => {
  const { data } = await axios.get("/auth/me");
  if (!data?.user) {
    throw new Error("No user data returned from server");
  }
  return data.user;
};

export const useMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 1000 * 60 * 5,
  });
};
