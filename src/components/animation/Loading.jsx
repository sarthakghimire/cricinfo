import Lottie from "lottie-react";
import animationData from "./../../../src/loading.json";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <Lottie
        animationData={animationData}
        loop={true}
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
};

export default Loading;
