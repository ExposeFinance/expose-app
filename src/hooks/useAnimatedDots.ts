import { useState, useEffect } from "react";

export const useAnimatedDots = (isActive: boolean): string => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setDots((prev) => (prev.length < 3 ? prev + "." : ""));
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on unmount or when `isActive` changes
    } else {
      setDots(""); // Reset dots when inactive
    }
  }, [isActive]);

  return dots;
};
