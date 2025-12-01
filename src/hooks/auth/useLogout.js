import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axiosConfig";

const logoutUser = async () => {
  await axios.post("/auth/logout");
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => queryClient.clear(),
  });
};
