import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-linear-to-r from-blue-900 to-indigo-900 text-white py-12 mt-20 border-t-4">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black tracking-wider">
              <span className="text-yellow-400">cricInfo</span>
              <p> {currentYear}</p>
            </h2>
            <div className="flex justify-center md:justify-start gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-blue-900 transition"
              >
                <span className="text-xl">F</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-blue-900 transition"
              >
                <span className="text-xl">T</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-yellow-400 hover:text-blue-900 transition"
              >
                <span className="text-xl">I</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-5 text-yellow-400">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/matches"
                  className="hover:text-yellow-400 transition"
                >
                  Live Matches
                </Link>
              </li>
              <li>
                <Link
                  to="/matches/upcoming"
                  className="hover:text-yellow-400 transition"
                >
                  Upcoming
                </Link>
              </li>
              <li>
                <Link
                  to="/matches/completed"
                  className="hover:text-yellow-400 transition"
                >
                  Results
                </Link>
              </li>
              <li>
                <Link
                  to="/points-table"
                  className="hover:text-yellow-400 transition"
                >
                  Points Table
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-5 text-yellow-400">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/teams" className="hover:text-yellow-400 transition">
                  Teams
                </Link>
              </li>
              <li>
                <Link
                  to="/players"
                  className="hover:text-yellow-400 transition"
                >
                  Players
                </Link>
              </li>
              <li>
                <Link to="/venues" className="hover:text-yellow-400 transition">
                  Venues
                </Link>
              </li>
              <li>
                <Link
                  to="/tournaments"
                  className="hover:text-yellow-400 transition"
                >
                  Tournaments
                </Link>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs mt-2 opacity-60">
              © {currentYear} cricInfo. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
