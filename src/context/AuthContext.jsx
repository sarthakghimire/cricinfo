import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, getMe, logoutUser, registerUser } from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  // const [user, setUser] = useState(null);

  // Load user if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getMe()
        .then((res) => {
          setUser(res);
        })
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

  // LOGIN
  const login = async (email, password) => {
    try {
      const res = await loginUser(email, password);

      localStorage.setItem("token", res.data.access_token);
      // console.log("token", res);
      setUser(res.user);

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || "Login failed" };
    }
  };

  // REGISTER
  const register = async (name, email, password) => {
    try {
      const data = { name, email, password };
      const res = await registerUser(data);
      return { success: true, data: res };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // LOGOUT
  const logout = async () => {
    await logoutUser();
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
