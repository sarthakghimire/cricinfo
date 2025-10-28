import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { users } from "../utils/users";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const login = (id, password) => {
    const foundUser = users.find((u) => u.id === id && u.password === password);
    if (foundUser) {
      if (foundUser.role === "admin") {
        setUser(foundUser);
        toast.success("Login successful!");
        navigate("/dashboard");
      } else {
        toast.error("Access denied: Admins only");
      }
    } else {
      toast.error("Invalid ID or password");
    }
  };

  const logout = () => {
    setUser(null);
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
