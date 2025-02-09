import {
  UserProfileContext,
  UserProfileContextType,
} from "@/context/UserProfileContext";
import { useContext } from "react";

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }
  return context;
};
