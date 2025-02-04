import React from "react";

const Loader: React.FC = () => {
  return (
    <div
      className="relative flex items-center justify-center w-full h-full"
      data-aos="fade-in"
    >
      {/* Outer Circular Progress Animation */}
      <svg
        className="absolute w-20 h-20 rotate-[-90deg]" // Keep the same size
        viewBox="0 0 100 100"
      >
        {/* Background Circle */}
        <circle
          cx="50"
          cy="50"
          r="40" // Keep the same radius
          fill="none"
          stroke="#E5E7EB" /* Background stroke */
          strokeWidth="10" // Thinner stroke width
        />
        {/* Progress Circle */}
        <circle
          cx="50"
          cy="50"
          r="40" // Match radius of background circle
          fill="none"
          stroke="#ff0598" /* Progress stroke */
          strokeWidth="10" // Match stroke width
          strokeDasharray="251" /* Circumference (2 * π * r) */
          strokeDashoffset="180" /* Adjust for partial progress */
          className="animate-progress"
        />
      </svg>

      {/* Bigger Centered Logo */}
      <div className="absolute flex items-center justify-center w-16 h-16  rounded-full">
        <img src="/expose-logo.png"></img>
      </div>

      {/* Inline CSS for animation */}
      <style>
        {`
          @keyframes progress {
            0% {
              stroke-dashoffset: 251;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }

          .animate-progress {
            animation: progress 3s ease-out infinite;
          }
        `}
      </style>
    </div>
  );
};

export default Loader;
