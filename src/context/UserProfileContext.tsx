import React, { createContext, useState, useEffect, ReactNode } from "react";

export interface UserProfile {
  name: string;
  profileImage: string;
}

export interface UserProfileContextType extends UserProfile {
  setUserProfile: (profile: UserProfile) => void;
}

export const DEFAULT_USER: UserProfile = {
  name: "Vitalik",
  profileImage: "https://github.com/shadcn.png",
};

export const UserProfileContext = createContext<
  UserProfileContextType | undefined
>(undefined);

export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userProfile, setUserProfileState] =
    useState<UserProfile>(DEFAULT_USER);

  useEffect(() => {
    const storedUser = localStorage.getItem("userProfile");
    if (storedUser) {
      setUserProfileState(JSON.parse(storedUser));
    }
  }, []);

  const setUserProfile = (newProfile: UserProfile) => {
    setUserProfileState(newProfile);
    localStorage.setItem("userProfile", JSON.stringify(newProfile));
  };

  return (
    <UserProfileContext.Provider value={{ ...userProfile, setUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};
