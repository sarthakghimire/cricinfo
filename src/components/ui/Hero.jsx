import Banner from "./../../assets/cricket_banner.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative w-full h-[600px] md:h-screen overflow-hidden flex items-center justify-center">
      {/* Background with Gradient Overlay */}
      <div className="absolute inset-0">
        <img
          src={Banner}
          alt="Cricket Banner"
          className="w-full h-full object-cover scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-black/70 mix-blend-multiply"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="flex flex-col items-center">          
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight drop-shadow-2xl">
            Experience Cricket <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Like Never Before
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
            Live scores, comprehensive stats, and real-time updates from the biggest tournaments around the globe.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full">
            <Link
              to="/matches"
              className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold text-lg rounded-full shadow-xl hover:shadow-yellow-500/20 hover:scale-105 transition-all transform duration-300 w-full sm:w-auto"
            >
              View Live Matches
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg rounded-full hover:bg-white/20 transition-all duration-300 w-full sm:w-auto"
            >
              Join the Community
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative Bottom Fade */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </div>
  );
};

export default Hero;
