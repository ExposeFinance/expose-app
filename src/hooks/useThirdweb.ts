import { ThirdwebContext } from "@/context/ThirdwebContext";
import { useContext } from "react";

// Custom hook for consuming the ThirdwebContext
export const useThirdweb = () => {
  const context = useContext(ThirdwebContext);
  if (!context) {
    throw new Error("useThirdweb must be used within a ThirdwebProvider");
  }
  return context;
};
