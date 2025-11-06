import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const { user, login, logout } = useAuth();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    login(id, password);
  };

  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <Link to={"/"} className="text-xl font-bold">
        cricINFO
      </Link>
      <div className="flex items-center">
        {!user ? (
          <form onSubmit={handleLogin} className="flex space-x-2">
            <input
              type="text"
              placeholder="Admin ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="p-1 text-black rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-1 text-black rounded"
            />
            <button
              type="submit"
              className="p-1 bg-white text-blue-600 rounded hover:bg-gray-200"
            >
              Login
            </button>
          </form>
        ) : (
          <button
            onClick={logout}
            className="p-1 bg-white text-blue-600 rounded hover:bg-gray-200"
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
