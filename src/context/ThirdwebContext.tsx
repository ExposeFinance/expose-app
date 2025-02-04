import React, { createContext, useContext, useEffect, useState } from "react";
import nebulaCreateSession from "../thirdweb/nebulaCreateSession";

type ThirdwebContextType = {
  sessionId: string;
};

const ThirdwebContext = createContext<ThirdwebContextType | undefined>(
  undefined
);

export const ThirdwebProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    // Create a new session when the provider mounts
    const createSession = async () => {
      try {
        const session = await nebulaCreateSession({
          title: "My session",
        });
        // Assuming the session object has a property like session.result.id
        setSessionId(session.result.id);
      } catch (error) {
        console.error("Error creating session:", error);
      }
    };

    createSession();
  }, []);

  return (
    <ThirdwebContext.Provider value={{ sessionId }}>
      {children}
    </ThirdwebContext.Provider>
  );
};

// Custom hook for consuming the ThirdwebContext
export const useThirdweb = () => {
  const context = useContext(ThirdwebContext);
  if (!context) {
    throw new Error("useThirdweb must be used within a ThirdwebProvider");
  }
  return context;
};
