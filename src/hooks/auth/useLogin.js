import { useMutation } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const loginUser = async ({ email, password }) => {
  const { data } = await axios.post("/auth/login", { email, password });
  return data;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
