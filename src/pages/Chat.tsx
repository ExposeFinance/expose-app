import React, { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/layout/PageLayout";
import { sepolia } from "thirdweb/chains";
import { useNebula } from "@/hooks/useNebula";
import { Button } from "@/components/ui/button.js";
import { useAnimatedDots } from "@/hooks/useAnimatedDots";
import { PreparedTransaction, sendTransaction } from "thirdweb";
import { openai } from "@/lib/utils";
import { Nebula } from "thirdweb/ai";
import { client } from "@/thirdweb/thirdwebClient.js";
import { AnimatedShinyText } from "@/components/ui/shimmer-text";
import { TextareaWithButton } from "@/components/InputPrompt";
import { useActiveAccount } from "thirdweb/react";
import { useAgent } from "@/hooks/useAgent";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const Chat: React.FC = () => {
  // ---------------------- State and Hooks ----------------------
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingTransactions, setPendingTransactions] = useState<
    PreparedTransaction[]
  >([]);
  const [executingTx, setExecutingTx] = useState(false);
  const { agent } = useAgent();

  //Auto scroll to bottom when new message is added
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  //Auto close keyboard on enter/chat click
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const dots = useAnimatedDots(loading);
  const { sessionId } = useNebula(); // from your context or environment
  const account = useActiveAccount();

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
    inputRef.current?.blur();
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
            prompt:
              "ETH, WETH, USDC, PAXOS, GOLD, Swap, SimpleSwap vitalik.eth, Sepolia, Polygon, Ethereum",
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

  // ---------------------- ElevenLabs ----------------------
  const messageQueueRef = useRef<string[]>([]); // Stores message texts to be fetched
  const audioQueueRef = useRef<string[]>([]); // Stores pre-fetched audio URLs
  const isSpeakingRef = useRef<boolean>(false); // Tracks if audio is currently playing
  const isFetchingRef = useRef<boolean>(false); // Tracks if an audio fetch is ongoing
  const isProcessingQueueRef = useRef<boolean>(false); // Prevents duplicate queue processing

  const fetchAudioForMessage = async (text: string) => {
    const voiceId = agent.voiceId;
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

    if (!voiceId || !apiKey) {
      console.error("ElevenLabs voiceId or API key is not set");
      return null;
    }

    try {
      isFetchingRef.current = true; // Mark API call as in progress

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error from ElevenLabs:", errorText);
        isFetchingRef.current = false;
        return null;
      }

      const audioBlob = await response.blob();
      isFetchingRef.current = false; // API request is done

      return URL.createObjectURL(audioBlob); // Return the pre-fetched audio URL
    } catch (error) {
      console.error("Error with ElevenLabs TTS:", error);
      isFetchingRef.current = false;
      return null;
    }
  };

  const processMessageQueue = async () => {
    if (isProcessingQueueRef.current) return; // Prevent multiple queue handlers from running
    isProcessingQueueRef.current = true;

    while (
      messageQueueRef.current.length > 0 ||
      audioQueueRef.current.length > 0
    ) {
      // Fetch audio while other messages play
      if (messageQueueRef.current.length > 0 && !isFetchingRef.current) {
        const nextMessage = messageQueueRef.current.shift();
        if (nextMessage) {
          fetchAudioForMessage(nextMessage).then((audioUrl) => {
            if (audioUrl) {
              audioQueueRef.current.push(audioUrl);
              processMessageQueue(); // Restart queue in case it's waiting
            }
          });
        }
      }

      // Play the next available audio if nothing is currently playing
      if (!isSpeakingRef.current && audioQueueRef.current.length > 0) {
        const audioUrl = audioQueueRef.current.shift();
        if (audioUrl) {
          const audio = new Audio(audioUrl);
          isSpeakingRef.current = true;

          await new Promise((resolve) => {
            audio.onended = () => {
              isSpeakingRef.current = false;
              resolve(true);
            };
            audio.play();
          });
        }
      }

      await new Promise((r) => setTimeout(r, 100)); // Prevent CPU-intensive looping
    }

    isProcessingQueueRef.current = false; // Queue processing is done
  };

  // When a new assistant message is added, process it immediately
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "assistant") {
      const sentences = lastMessage.content.split(/(?<=[.!?])\s+/); // Split into sentences
      const firstSentence = sentences.slice(0, 1).join(" "); // Take the first two
      if (firstSentence.trim()) {
        messageQueueRef.current.push(firstSentence);
        processMessageQueue(); // Start processing queue immediately
      }
    }
  }, [messages]);

  // ---------------------- Transaction Confirm/Decline ----------------------
  const handleConfirmTransactions = async () => {
    setExecutingTx(true);
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: `Executing transactions${dots}`,
      },
    ]);

    try {
      for (const tx of pendingTransactions) {
        if (account) {
          const txReceipt = await sendTransaction({
            transaction: tx,
            account: account,
          });
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `✅ Transaction executed successfully! Tx Hash: ${txReceipt?.transactionHash}`,
            },
          ]);
        }
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
        <TextareaWithButton
          ref={inputRef} // Forward the ref to the Textarea.
          prompt={prompt}
          setPrompt={setPrompt}
          handleSend={handleSend}
          loading={loading}
          dots={dots}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />
      }
    >
      {/* Show the instructional card only if there are no chat messages yet */}
      {messages.length === 0 && (
        <Card className="bg-surface-primary border-none shadow-none">
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
              Or, <strong>long press</strong> the <strong>Chat</strong> button
              to record your <strong>voice</strong> and automatically send the
              transcribed text using <strong>OpenAI Whisper</strong>.
            </p>
            <p>
              Behind the scenes, we use a combination of models such as{" "}
              <strong>OpenAI</strong> and <strong>Claude</strong> to generate
              responses and perform on-chain actions.
            </p>
            <p>
              Swap, send, borrow, and lend crypto with your{" "}
              <strong>AI agent.</strong>
            </p>
            <p>
              Featuring a <strong>gasless</strong> and <strong>signless</strong>{" "}
              UX, access to <strong>2500+ EVM chains</strong>, and{" "}
              <strong>crosschain transactions</strong>.
            </p>
            <p>Enjoy the power of AI-driven interactions onchain!</p>
          </CardContent>
        </Card>
      )}

      {/* Chat Messages Thread */}
      <div className="flex flex-col space-y-2 mb-4">
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";

          return (
            <div
              key={idx}
              // "flex" container for the avatar + bubble
              // If it's user, we "reverse" the row to put the avatar on the right
              className={`flex items-end ${isUser ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <img
                src={
                  isUser
                    ? "https://github.com/shadcn.png"
                    : `${agent.profileImage}`
                }
                alt={isUser ? "User Avatar" : "Assistant Avatar"}
                className="w-8 h-8 rounded-full m-2"
              />

              {/* Chat Bubble */}
              <Card
                className={`max-w-[70%] px-2 ${
                  isUser
                    ? "bg-pink-500 text-white-100 self-end"
                    : "bg-surface-primary self-start"
                }`}
              >
                <CardContent className="p-2">
                  <div className="text-sm break-words">{msg.content}</div>
                </CardContent>
              </Card>
            </div>
          );
        })}

        {/* 2) While loading, show a "typing" bubble at the bottom with dynamic dots */}
        {loading && (
          <div className="flex items-end">
            {/* Assistant avatar on the left */}
            <img
              src={agent.profileImage}
              alt="Assistant Avatar"
              className="w-8 h-8 rounded-full m-2"
            />
            <Card className="max-w-[70%] p-0 self-start bg-surface-primary">
              <CardContent className="p-2">
                <AnimatedShinyText className="text-sm text-text-secondary break-words">
                  ✨ {agent.name} is responding{dots}
                </AnimatedShinyText>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Dummy div for auto-scroll (if you have that logic) */}
        <div ref={messagesEndRef} />
      </div>

      {/* If we have transactions to confirm, show them */}
      {pendingTransactions.length > 0 && (
        <Card className="p-0 bg-surface-primary">
          <CardContent className="p-4 flex flex-col space-y-4">
            <div className="w-full text-center text-sm font-semibold">
              Transaction Confirmation
            </div>
            {pendingTransactions.map((tx, idx) => (
              <div key={idx} className="rounded p-2 text-sm break-words">
                <div>Transaction {idx + 1}:</div>
                <div>To: {String(tx?.to)}</div>
                <div>Value: {String(tx.value)}</div>
                <div>Data: {String(tx.data)}</div>
              </div>
            ))}

            {/* Confirm/Decline Buttons */}
            <div className="flex space-x-2 grow w-full">
              <Button
                onClick={handleConfirmTransactions}
                disabled={executingTx}
                variant="success"
                className="flex-grow"
              >
                {executingTx ? "Executing..." : "Yes, Execute"}
              </Button>
              <Button
                onClick={handleDeclineTransactions}
                variant="destructive"
                className="flex-grow"
              >
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
