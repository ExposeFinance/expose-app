import React from "react";
import Lottie from "react-lottie-player";
import lottie from "../../assets/lottie/loader.json";

const Loader: React.FC = () => {
  return (
    <div
      className="relative flex items-center justify-center w-full h-full"
      data-aos="fade-in"
    >
      {/* Lottie Animation */}
      <Lottie
        loop
        animationData={lottie}
        play
        className="w-32 h-32" // Adjust size as needed
      />
    </div>
  );
};

export default Loader;
