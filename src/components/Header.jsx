import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Header = () => {
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState("sarthak@gmail.com");
  const [password, setPassword] = useState("Sarthak123@");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const result = await login(email, password);
      toast.success("Login successful!");

      // const token = result.data.access_token;
      // localStorage.setItem("token", token);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(result.error || "Invalid email or password");
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        <Link to="/" className="text-3xl font-black">
          <span className="text-yellow-400">cricINFO</span>
        </Link>

        <div className="flex items-center gap-6">
          {!user ? (
            <>
              <form
                onSubmit={handleLogin}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-5 py-2"
              >
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-white placeholder-white/70 outline-none w-40 text-sm"
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
                  className="bg-yellow-400 text-blue-900 font-bold px-6 py-2 rounded-full hover:bg-yellow-300 transition"
                >
                  LOGIN
                </button>
              </form>

              <button
                onClick={() => navigate("/register")}
                className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-full text-sm font-semibold transition"
              >
                REGISTER
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                Welcome,{" "}
                <span className="text-yellow-400 font-bold">
                  {user.name || user.email}
                </span>
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-full transition"
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
