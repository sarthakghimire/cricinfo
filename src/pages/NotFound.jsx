import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="h-screen flex flex-col justify-around">
      <p className="text-red-600">
        The page you are looking for is not available.
      </p>
      <Link
        className="m-4 p-4 bg-blue-500 rounded-2xl w-70 text-amber-50 shadow-2xl"
        to={"/"}
      >
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
