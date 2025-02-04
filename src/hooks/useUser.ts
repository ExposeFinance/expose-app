import { UserContext } from "@/context/UserContext";
import { useContext } from "react";

/**
 * Hook to use the User
 * Throws an error if used outside the UserProvider
 */
export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within an UserProvider");
  }

  return context;
};
