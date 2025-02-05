import React, { useState, useRef, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/layout/PageLayout";
import { sepolia } from "thirdweb/chains";
import { useThirdweb } from "../context/ThirdwebContext";
import { Button } from "@/components/ui/button.js";
import { useAnimatedDots } from "@/hooks/useAnimatedDots";
import { sendTransaction } from "thirdweb";
import { account, openai } from "@/lib/utils";
import { Nebula } from "thirdweb/ai";
import { client } from "@/thirdweb/thirdwebClient.js";
import { ChatVoiceButton } from "@/components/ChatButton";
import { Input } from "@/components/ui/input";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const Chat: React.FC = () => {
  // ---------------------- State and Hooks ----------------------
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);
  const [executingTx, setExecutingTx] = useState(false);

  const dots = useAnimatedDots(loading);
  const { sessionId } = useThirdweb(); // from your context or environment

  // ---------------------- Voice Recording Refs ----------------------
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // ---------------------- Helper to Send Any Text ----------------------
  const handleSendWithText = useCallback(
    async (text: string) => {
      const cleanText = text.trim();
      if (!cleanText) return;

      // Add the user's message to chat
      const userMessage: ChatMessage = { role: "user", content: cleanText };
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);
      setPrompt("");

      try {
        // Call Nebula.chat with the provided text
        const response = await Nebula.chat({
          client: client,
          sessionId: sessionId,
          message: cleanText,
          contextFilter: {
            chains: [sepolia],
          },
          account: account,
        });

        // Show the assistant's response
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: response.message || "No message returned",
          },
        ]);

        // If there are transactions, store them so we can confirm
        if (response.transactions && response.transactions.length > 0) {
          setPendingTransactions(response.transactions);
        }
      } catch (error) {
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
      }
    },
    [sessionId]
  );

  // ---------------------- handleSend (typed) ----------------------
  const handleSend = async (voiceInput?: string) => {
    if (!prompt && !voiceInput) return;
    if (voiceInput) {
      await handleSendWithText(voiceInput);
    } else {
      await handleSendWithText(prompt);
    }
  };

  // ---------------------- Voice Recording: Start ----------------------
  const startRecording = async () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert("Audio recording is not supported in this browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Collect each chunk
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      // When the recorder fully stops, create the Blob here
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        try {
          // Convert to File
          const audioFile = new File([audioBlob], "recording.webm", {
            type: "audio/webm",
          });

          // Send to Whisper for transcription
          const transcription = await openai.audio.transcriptions.create({
            file: audioFile,
            model: "whisper-1",
          });
          // Send the transcribed text
          await handleSend(transcription?.text);
        } catch (error) {
          console.error("Whisper error:", error);
        }
      };

      mediaRecorder.start();
      console.log("mediaRecorder started");
    } catch (err) {
      console.error("Microphone access error:", err);
      alert("Could not access microphone");
    }
  };

  // ---------------------- Voice Recording: Stop ----------------------
  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // ---------------------- Transaction Confirm/Decline ----------------------
  const handleConfirmTransactions = async () => {
    setExecutingTx(true);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "Executing transactions...",
      },
    ]);

    try {
      for (const tx of pendingTransactions) {
        const txReceipt = await sendTransaction({
          transaction: tx,
          account,
        });
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `Transaction executed successfully. Tx Hash: ${txReceipt?.transactionHash}`,
          },
        ]);
      }
    } catch (err) {
      console.error("Error executing transaction:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error executing transaction: ${
            err instanceof Error ? err.message : err
          }`,
        },
      ]);
    } finally {
      setExecutingTx(false);
      setPendingTransactions([]); // Clear out after execution
    }
  };

  const handleDeclineTransactions = () => {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Transactions were not executed." },
    ]);
    setPendingTransactions([]);
  };

  // ---------------------- Render ----------------------
  return (
    <PageLayout
      title="Chat"
      promptInput={
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            className="flex-1"
          />
          <ChatVoiceButton
            onClick={() => handleSend()} // short press => typed
            onVoiceStart={startRecording} // long press => start
            onVoiceStop={stopRecording} // release => stop
            disabled={loading}
          >
            {loading ? `Reasoning${dots}` : "Chat"}
          </ChatVoiceButton>
        </div>
      }
    >
      {/* Show the instructional card only if there are no chat messages yet */}
      {messages.length === 0 && (
        <Card className="bg-surface-primary border-none shadow-none my-4">
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">GM!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4 text-sm md:text-base">
            <p>
              You can type your question and click <strong>Chat</strong> (or
              press
              <strong> Enter</strong>) to talk to the agent.
            </p>
            <p>
              Or, <strong>long press</strong> the Chat button to record your
              voice and automatically send the transcribed text using{" "}
              <strong>OpenAI Whisper</strong>.
            </p>
            <p>
              Behind the scenes, we use a combination of models such as{" "}
              <strong>OpenAI</strong> and <strong>Claude</strong> to generate
              responses and perform on-chain actions.
            </p>
            <p>
              Swap, send, borrow, and lend crypto with just your voice or typed
              queries. Enjoy the power of AI-driven interactions!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Chat Messages Thread */}
      <div className="flex flex-col space-y-2 mb-4">
        {messages.map((msg, idx) => (
          <Card
            key={idx}
            className={`max-w-full p-0 ${
              msg.role === "user"
                ? "self-end bg-pink-500 text-text-inverse"
                : "self-start bg-surface-primary"
            }`}
          >
            <CardContent className="p-2">
              <div className="text-sm break-words">{msg.content}</div>
            </CardContent>
          </Card>
        ))}
        {/* 2) While loading, show a "typing" bubble at the bottom with dynamic dots */}
        {loading && (
          <Card className="`max-w-full p-0 self-start bg-surface-primary">
            <CardContent className="p-2">
              <div className="text-sm text-text-secondary break-words">
                Reasoning{dots}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* If we have transactions to confirm, show them */}
      {pendingTransactions.length > 0 && (
        <Card className="p-0 bg-yellow-100">
          <CardContent className="p-4 flex flex-col space-y-4">
            <div className="text-sm text-black font-semibold">
              The following transactions are ready to be executed:
            </div>
            {pendingTransactions.map((tx, idx) => (
              <div
                key={idx}
                className="rounded border border-gray-300 p-2 text-sm"
              >
                <div>Transaction {idx + 1}:</div>
                <div>To: {tx?.to}</div>
                <div>Value: {tx.value}</div>
                <div>Data: {tx.data}</div>
              </div>
            ))}

            {/* Confirm/Decline Buttons */}
            <div className="flex space-x-2">
              <Button
                onClick={handleConfirmTransactions}
                disabled={executingTx}
                variant="default"
              >
                {executingTx ? "Executing..." : "Yes, Execute"}
              </Button>
              <Button onClick={handleDeclineTransactions} variant="outline">
                No, Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
};

export default Chat;
