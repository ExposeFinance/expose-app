import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useThemeMode } from "./hooks/useThemeMode";
import AppLayout from "@/components/layout/AppLayout";
import { AlertProvider } from "@/context/AlertContext";
import Wallet from "@/pages/Wallet";
import Chat from "./pages/Chat";
import { IntroDisclosure } from "@/components/ui/intro-disclosure";
import { useEffect, useState } from "react";
import ThirdwebProvider from "./components/providers/ThirdwebProvider";
import { NebulaProvider } from "./context/NebulaContext";
import { AgentProvider } from "@/context/AgentContext";

const steps = [
  {
    title: "Welcome to Expose!",
    short_description:
      "Swap, send, borrow and lend crypto with just your voice.",
    full_description:
      "Welcome to Expose! We are a voice-first crypto wallet that allows you to interact with your crypto assets using just your voice. With Expose, you can swap, send, borrow, lend, and more, all with just your voice. We are excited to have you on board!",
    media: {
      type: "image" as const,
      src: "/expose-gm.png",
      alt: "Feature Image",
    },
  },
  {
    title: "Chat",
    short_description:
      "Enjoy a simple chat interface to access crypto with your agent",
    full_description:
      "Welcome to Expose! We are a voice-first crypto wallet that allows you to interact with your crypto assets using just your voice. With Expose, you can swap, send, borrow, lend, and more, all with just your voice. We are excited to have you on board!",
    media: {
      type: "image" as const,
      src: "/expose-chat.png",
      alt: "Feature Image",
    },
  },
  {
    title: "Voice Mode",
    short_description:
      "Simply hold the Chat button to talk! Push-to-talk crypto interactions are here.",
    full_description:
      "Welcome to Expose! We are a voice-first crypto wallet that allows you to interact with your crypto assets using just your voice. With Expose, you can swap, send, borrow, lend, and more, all with just your voice. We are excited to have you on board!",
    media: {
      type: "image" as const,
      src: "/expose-voice.png",
      alt: "Feature Image",
    },
  },
  {
    title: "Learn",
    short_description:
      "Ask your agent to learn more about crypto, such as what are NFTs, how to build a smart contract, and more!",
    full_description:
      "Welcome to Expose! We are a voice-first crypto wallet that allows you to interact with your crypto assets using just your voice. With Expose, you can swap, send, borrow, lend, and more, all with just your voice. We are excited to have you on board!",
    media: {
      type: "image" as const,
      src: "/expose-learn.png",
      alt: "Feature Image",
    },
  },
  {
    title: "Query",
    short_description:
      "Query your agent for the latest crypto prices, smart contracts, blockchain stats, and more!",
    full_description:
      "Welcome to Expose! We are a voice-first crypto wallet that allows you to interact with your crypto assets using just your voice. With Expose, you can swap, send, borrow, lend, and more, all with just your voice. We are excited to have you on board!",
    media: {
      type: "image" as const,
      src: "/expose-query.png",
      alt: "Feature Image",
    },
  },
  {
    title: "Transact",
    short_description:
      "Swap, send, lend and borrow.. and more! Make transactions onchain effortlessly.",
    full_description:
      "Welcome to Expose! We are a voice-first crypto wallet that allows you to interact with your crypto assets using just your voice. With Expose, you can swap, send, borrow, lend, and more, all with just your voice. We are excited to have you on board!",
    media: {
      type: "image" as const,
      src: "/expose-transact.png",
      alt: "Feature Image",
    },
  },
  {
    title: "Wallet",
    short_description:
      "Built in signless, gasless wallet, supporting up to 2500+ EVM chains, and crosschain transactions",
    full_description:
      "Welcome to Expose! We are a voice-first crypto wallet that allows you to interact with your crypto assets using just your voice. With Expose, you can swap, send, borrow, lend, and more, all with just your voice. We are excited to have you on board!",
    media: {
      type: "image" as const,

      src: "/expose-wallet.png",
      alt: "Feature Image",
    },
  },
  {
    title: "Personalize",
    short_description: "Customize your agent's appearance and voice",
    full_description:
      "Welcome to Expose! We are a voice-first crypto wallet that allows you to interact with your crypto assets using just your voice. With Expose, you can swap, send, borrow, lend, and more, all with just your voice. We are excited to have you on board!",
    media: {
      type: "image" as const,

      src: "/expose-personalize.png",
      alt: "Feature Image",
    },
  },
];

function App() {
  useThemeMode();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <IntroDisclosure
        steps={steps}
        featureId="intro"
        onComplete={() => setOpen(false)}
        onSkip={() => setOpen(false)}
        setOpen={setOpen}
        open={open}
      />

      <ThirdwebProvider>
        <NebulaProvider>
          <AgentProvider>
            <AlertProvider>
              <Router>
                <AppLayout>
                  <Routes>
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/chat" element={<Chat />} />

                    <Route path="*" element={<Chat />} />
                  </Routes>
                </AppLayout>
              </Router>
            </AlertProvider>
          </AgentProvider>
        </NebulaProvider>
      </ThirdwebProvider>
    </>
  );
}

export default App;
