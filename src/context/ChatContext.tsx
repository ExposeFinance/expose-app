import React, { createContext, useState, ReactNode } from "react";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export interface ChatContextProps {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  clearMessages: () => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export const ChatContext = createContext<ChatContextProps | undefined>(
  undefined
);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const clearMessages = () => setMessages([]);

  return (
    <ChatContext.Provider
      value={{ messages, addMessage, clearMessages, setMessages }}
    >
      {children}
    </ChatContext.Provider>
  );
};
