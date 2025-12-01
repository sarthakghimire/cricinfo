import { useMutation } from "@tanstack/react-query";
import axios from "./../../api/axiosConfig";

const registerUser = async (formData) => {
  const { data } = await axios.post("/auth/register", formData);
  return data;
};

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};
