import { createContext, useContext, useEffect } from "react";
import { useLogin } from "./../hooks/auth/useLogin";
import { useLogout } from "./../hooks/auth/useLogout"; //
import { useMe } from "./../hooks/auth/useMe";
import { useRegister } from "./../hooks/auth/useRegister";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { data: user, isLoading: isLoadingUser } = useMe();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  useEffect(() => {
    if (user) {
    } else if (
      !isLoadingUser &&
      user === null &&
      localStorage.getItem("token")
    ) {
      localStorage.removeItem("token");
    }
  }, [user, isLoadingUser]);

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await loginMutation.mutateAsync({ email, password });

      localStorage.setItem("token", res.data.access_token);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error:
          error?.response?.data?.message || error.message || "Login failed",
      };
    }
  };

  // REGISTER
  const register = async (name, email, password) => {
    try {
      const res = await registerMutation.mutateAsync({ name, email, password });
      return { success: true, data: res };
    } catch (error) {
      return {
        success: false,
        error:
          error?.response?.data?.message ||
          error.message ||
          "Registration failed",
      };
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (err) {
      console.warn("Logout API failed, clearing locally anyway");
    } finally {
      localStorage.removeItem("token");
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading:
      isLoadingUser || loginMutation.isPending || registerMutation.isPending,
    isLoggedIn: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
