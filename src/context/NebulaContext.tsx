import React, { createContext, useEffect, useState } from "react";
import nebulaCreateSession from "../thirdweb/nebulaCreateSession";

export type NebulaContextType = {
  sessionId: string;
};

export const NebulaContext = createContext<NebulaContextType | undefined>(
  undefined
);

export const NebulaProvider: React.FC<{ children: React.ReactNode }> = ({
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
    <NebulaContext.Provider value={{ sessionId }}>
      {children}
    </NebulaContext.Provider>
  );
};
