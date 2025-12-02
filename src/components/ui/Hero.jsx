import Banner from "./../../assets/cricket_banner.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative w-full h-96 md:h-screen overflow-hidden">
      {/* Background Image */}
      <img
        src={Banner}
        alt="Cricket Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Text Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to cricINFO
        </h1>
        <p className="text-lg md:text-xl max-w-2xl">
          Experience the thrill of the game with live scores, highlights, and
          more.
        </p>
        <Link
          to={"/matches"}
          className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition cursor-pointer"
        >
          Explore Matches
        </Link>
      </div>
    </div>
  );
};

export default Hero;
