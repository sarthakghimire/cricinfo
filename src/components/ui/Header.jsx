import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Header = () => {
  const { user, login, logout } = useAuth();
  const [email, setEmail] = useState("sarthak@gmail.com");
  const [password, setPassword] = useState("Sarthak123@");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(email, password);
      toast.success("Login successful!");
      navigate("/dashboard", { replace: true });
      setIsMenuOpen(false);
    } catch (error) {
      toast.error(result.error || "Invalid email or password");
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-blue-950 to-black text-white shadow-lg h-16 relative z-50">
      <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
        <Link to="/" className="text-3xl font-black">
          <span className="text-yellow-400">WicketEsque</span>
        </Link>

        {/* Desktop View */}
        <div className="hidden md:flex items-center gap-6">
          {!user ? (
            <>
              <form
                onSubmit={handleLogin}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5"
              >
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-white placeholder-white/70 outline-none w-36 text-sm"
                  required
                />
                <span className="text-white/50">|</span>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent text-white placeholder-white/70 outline-none w-28 text-sm"
                  required
                />
                <button
                  type="submit"
                  className="bg-yellow-400 text-blue-900 font-bold px-4 py-1 rounded-full text-xs hover:bg-yellow-300 transition"
                >
                  LOGIN
                </button>
              </form>

              <button
                onClick={() => navigate("/register")}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold transition"
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
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-1.5 rounded-full text-sm transition"
              >
                LOGOUT
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-white focus:outline-none"
        >
          {isMenuOpen ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-blue-950/95 border-t border-blue-900 backdrop-blur-md shadow-xl p-6 flex flex-col gap-6 animate-fade-in">
          {!user ? (
            <>
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 p-3 rounded-lg text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white/10 p-3 rounded-lg text-white placeholder-white/70 outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <button
                  type="submit"
                  className="bg-yellow-400 text-blue-900 font-bold py-3 rounded-lg hover:bg-yellow-300 transition"
                >
                  LOGIN
                </button>
              </form>
              <div className="text-center text-white/50 text-sm">or</div>
              <button
                onClick={() => {
                  navigate("/register");
                  setIsMenuOpen(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
              >
                REGISTER NEW ACCOUNT
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-6 text-center">
              <div className="text-lg">
                <span className="text-gray-300">Logged in as </span>
                <span className="text-yellow-400 font-bold block text-xl mt-1">
                  {user.name || user.email}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition w-full"
              >
                LOGOUT
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
