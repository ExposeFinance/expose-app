import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/layout/PageLayout";
import nebulaChat from "../thirdweb/nebulaChat.js";
import { sepolia } from "thirdweb/chains";
import { useThirdweb } from "../context/ThirdwebContext";
import { Button } from "@/components/ui/button.js";
import { useAnimatedDots } from "@/hooks/useAnimatedDots";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const dots = useAnimatedDots(loading);

  const { sessionId } = useThirdweb();

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: prompt.trim() };
    setPrompt("");
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await nebulaChat({
        message: prompt.trim(),
        sessionId,
        contextFilter: {
          chains: [sepolia],
        },
      });

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.message || "No message returned",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: unknown) {
      console.error("Error during nebulaChat:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? `Error: ${error.message}`
              : "Unknown error occurred",
        },
      ]);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  return (
    <PageLayout
      title="Chat"
      promptInput={
        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-1 p-2 border rounded"
            placeholder="Type your message..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <Button onClick={handleSend} disabled={loading} className="w-1/3">
            {loading ? `Sending${dots}` : "Send"}
          </Button>
        </div>
      }
    >
      {/* Chat Messages Thread */}
      <div className="flex flex-col space-y-2">
        {messages.map((msg, idx) => (
          <Card
            key={idx}
            className={`max-w-full p-0 ${
              msg.role === "user"
                ? "self-end bg-pink-500"
                : "self-start bg-surface-primary"
            }`}
          >
            <CardContent className="p-2">
              <div
                className={`text-sm ${
                  msg.role === "user" ? "text-white" : "text-black"
                }`}
              >
                {msg.content}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageLayout>
  );
};

export default Chat;
