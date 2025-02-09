import React, { createContext, useState, useEffect, ReactNode } from "react";

interface Agent {
  name: string;
  voiceId: string;
  profileImage: string;
}

export interface AgentContextType {
  agent: Agent;
  setAgent: (agent: Agent) => void;
}

const DEFAULT_AGENT: Agent = {
  name: "Expose",
  voiceId: "EXAVITQu4vr4xnSDxMaL", // Default ElevenLabs voice ID
  profileImage: "/expose-logo.png", // Default profile image
};

export const AgentContext = createContext<AgentContextType | undefined>(
  undefined
);

export const AgentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [agent, setAgentState] = useState<Agent>(DEFAULT_AGENT);

  useEffect(() => {
    const storedAgent = localStorage.getItem("agentConfig");
    if (storedAgent) {
      setAgentState(JSON.parse(storedAgent));
    }
  }, []);

  const setAgent = (newAgent: Agent) => {
    setAgentState(newAgent);
    localStorage.setItem("agentConfig", JSON.stringify(newAgent));
  };

  return (
    <AgentContext.Provider value={{ agent, setAgent }}>
      {children}
    </AgentContext.Provider>
  );
};
