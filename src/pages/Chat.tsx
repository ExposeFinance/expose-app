import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/layout/PageLayout";
import { sepolia } from "thirdweb/chains";
import { useThirdweb } from "../context/ThirdwebContext";
import { Button } from "@/components/ui/button.js";
import { useAnimatedDots } from "@/hooks/useAnimatedDots";
import { sendTransaction } from "thirdweb";
import { account, openai } from "@/lib/utils"; // Import pre-instantiated OpenAI client
import { Nebula } from "thirdweb/ai";
import { client } from "@/thirdweb/thirdwebClient.js";
import { ChatVoiceButton } from "@/components/ChatButton";
import { Input } from "@/components/ui/input";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);
  const [executingTx, setExecutingTx] = useState(false);
  
  // New state for Whisper recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const dots = useAnimatedDots(loading);
  const { sessionId } = useThirdweb(); // Assume you have "account" from context or wherever

  const stopRecording = useCallback(async () => {
    if (!mediaRecorderRef.current) return;

    mediaRecorderRef.current.stop();
    
    // Stop all tracks in the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Create audio blob and transcribe
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    
    try {
      // Convert Blob to File
      const audioFile = new File([audioBlob], 'recording.webm', { 
        type: 'audio/webm' 
      });

      // Send to OpenAI Whisper
      const transcription = await openai.audio.transcriptions.create({
        file: audioFile,
        model: "whisper-1",
      });

      // Set the transcribed text as the prompt
      setPrompt(transcription.text);

      // Use setTimeout to ensure state is updated before sending
      setTimeout(async () => {
        await handleSend();
      }, 0);
    } catch (error) {
      console.error("Whisper transcription error:", error);
      //alert("Failed to transcribe audio"); -- Always throwing an error right now
    }
  }, []);

  const startRecording = useCallback(async () => {
    // Check if browser supports audio recording
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert("Audio recording is not supported in this browser.");
      return;
    }

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Start recording
      mediaRecorder.start();

      // Handle data collection
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
    } catch (error) {
      console.error("Microphone access error:", error);
      alert("Could not access microphone");
    }
  }, []);

  const handleSend = async () => {
    if (!prompt || prompt==="") return;
    const userMessage: ChatMessage = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await Nebula.chat({
        client: client,
        sessionId: sessionId,
        message: prompt,
        contextFilter: {
          chains: [sepolia],
        },
        account: account,
      });
      // const response = await nebulaChat({
      //   message: prompt,
      //   sessionId,
      //   contextFilter: { chains: [sepolia] },
      // });

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
      setPrompt("");
    }
  };

  // Handle user's "Yes" to execute transactions
  const handleConfirmTransactions = async () => {
    setExecutingTx(true);

    // (Optional) Add a message to let user know we're executing
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "Executing transactions...",
      },
    ]);

    try {
      for (const tx of pendingTransactions) {
        // You may need to adapt this call to match your environment
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

  // Handle user's "No" to reject transactions
  const handleDeclineTransactions = () => {
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "Transactions were not executed." },
    ]);
    setPendingTransactions([]);
  };

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
            className="flex-1" // This ensures the input takes up available width.
          />
          <ChatVoiceButton 
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onMouseLeave={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            disabled={loading}
          >
            {loading ? `Reasoning${dots}` : "Chat"}
          </ChatVoiceButton>
          
        </div>
      }
    >
      {/* Chat Messages Thread */}
      <div className="flex flex-col space-y-2 mb-4">
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
              <div className={`text-sm break-words`}>{msg.content}</div>
            </CardContent>
          </Card>
        ))}
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