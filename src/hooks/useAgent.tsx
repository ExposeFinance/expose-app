import { AgentContext, AgentContextType } from "@/context/AgentContext";
import { useContext } from "react";

export const useAgent = (): AgentContextType => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error("useAgent must be used within an AgentProvider");
  }
  return context;
};
