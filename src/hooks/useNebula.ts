import { NebulaContext } from "@/context/NebulaContext";
import { useContext } from "react";

// Custom hook for consuming the NebulaContext
export const useNebula = () => {
  const context = useContext(NebulaContext);
  if (!context) {
    throw new Error("useNebula must be used within a ThirdwebProvider");
  }
  return context;
};
