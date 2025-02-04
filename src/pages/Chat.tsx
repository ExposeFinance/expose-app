import React, { useState } from "react";
// Import your nebulaChat function and any required chain info
import nebulaChat from "../thirdweb/nebulaChat.js";
import { sepolia } from "thirdweb/chains";
import { useThirdweb } from "../context/ThirdwebContext";

// Define a simple type for messages
type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  // Get the sessionId from our ThirdwebContext instead of hard-coding it.
  const { sessionId } = useThirdweb();

  const handleSend = async () => {
    if (!prompt.trim()) return;

    // Append the user's message to the conversation.
    const userMessage: ChatMessage = { role: "user", content: prompt.trim() };
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

      // Assume that the response has a "message" property.
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.message || "No message returned",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error during nebulaChat:", error.message);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Error: " + error },
        ]);
      } else {
        console.error("Unknown error during nebulaChat:", error);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Unknown error occurred" },
        ]);
      }
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* Chat window */}
      <div className="flex-1 p-4 overflow-auto border rounded">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block px-4 py-2 rounded ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input and send button */}
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
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;
