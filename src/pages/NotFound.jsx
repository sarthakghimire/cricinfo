import React from "react";
import Header from "../components/Header";

const NotFound = () => {
  return (
    <div>
      <Header />
      <p className="text-red-600">
        The page you are looking for is not available.
      </p>
    </div>
  );
};

export default NotFound;
