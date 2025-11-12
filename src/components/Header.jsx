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
    <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-2xl border-b-4 border-yellow-400">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        {/* Logo */}
        <Link to={"/"} className="flex items-center gap-3 group">
          <div className="text-3xl font-black tracking-wider">
            <span className="text-yellow-400">cricInfo</span>
          </div>
        </Link>

        {/* Auth Section */}
        <div className="flex items-center gap-6">
          {!user ? (
            <form
              onSubmit={handleLogin}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-5 py-2 border border-white/30"
            >
              <input
                type="text"
                placeholder="Admin ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="bg-transparent text-white placeholder-white/70 outline-none w-32 text-sm"
                required
              />
              <span className="text-white/50">|</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-white placeholder-white/70 outline-none w-32 text-sm"
                required
              />
              <button
                type="submit"
                className="bg-yellow-400 text-blue-900 font-bold px-6 py-2 rounded-full hover:bg-yellow-300 transition shadow-lg"
              >
                LOGIN
              </button>
            </form>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                Welcome,{" "}
                <span className="text-yellow-400 font-bold">
                  {user.name || "Admin"}
                </span>
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-full transition shadow-lg"
              >
                LOGOUT
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
