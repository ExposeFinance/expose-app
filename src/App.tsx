import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useThemeMode } from "./hooks/useThemeMode";
import AppLayout from "@/components/layout/AppLayout";
import { AlertProvider } from "@/context/AlertContext";
import Wallet from "@/pages/Wallet";
import Chat from "./pages/Chat";
import { ThirdwebProvider } from "./context/ThirdwebContext";
import { IntroDisclosure } from "@/components/ui/intro-disclosure";
import { useEffect, useState } from "react";

const steps = [
  {
    title: "Welcome to Expose!",
    short_description:
      "Swap, send, borrow and lend crypto with just your voice.",
    full_description:
      "Welcome to Cult UI! Let's explore how our beautifully crafted components can help you build stunning user interfaces with ease.",
    media: {
      type: "image" as const,
      src: "/expose-splash.png",
      alt: "Feature Image",
    },
  },
  {
    title: "Chat",
    short_description:
      "Enjoy a simple chat interface to access crypto with your agent",
    full_description:
      "Every component is built with customization in mind. Use our powerful theming system with Tailwind CSS to match your brand perfectly.",
    media: {
      type: "image" as const,
      src: "/expose-splash.png",
      alt: "Feature Image",
    },
  },
  {
    title: "Voice Mode",
    short_description:
      "Simply hold the Chat button to talk! Push-to-talk crypto interactions are here.",
    full_description:
      "Every component is built with customization in mind. Use our powerful theming system with Tailwind CSS to match your brand perfectly.",
    media: {
      type: "image" as const,
      src: "/expose-splash.png",
      alt: "Feature Image",
    },
  },
  {
    title: "Learn",
    short_description:
      "Ask your agent to learn more about crypto, such as what are NFTs, how to build a smart contract, and more!",
    full_description:
      "Every component is built with customization in mind. Use our powerful theming system with Tailwind CSS to match your brand perfectly.",
    media: {
      type: "image" as const,
      src: "/expose-splash.png",
      alt: "Feature Image",
    },
  },
  {
    title: "Query",
    short_description:
      "Query your agent for the latest crypto prices, smart contracts, blockchain stats, and more!",
    full_description:
      "Every component is built with customization in mind. Use our powerful theming system with Tailwind CSS to match your brand perfectly.",
    media: {
      type: "image" as const,
      src: "/expose-splash.png",
      alt: "Feature Image",
    },
  },
  {
    title: "Transact",
    short_description:
      "Swap, send, lend and borrow.. and more! Make transactions onchain effortlessly.",
    full_description:
      "Every component is built with customization in mind. Use our powerful theming system with Tailwind CSS to match your brand perfectly.",
    media: {
      type: "image" as const,
      src: "/expose-splash.png",
      alt: "Feature Image",
    },
  },
  {
    title: "Wallet",
    short_description:
      "Built in signless, gasless wallet, supporting up to 2500+ EVM chains, and crosschain transactions",
    full_description:
      "All components are fully responsive and follow WAI-ARIA guidelines, ensuring your application works seamlessly across all devices and is accessible to everyone.",
    media: {
      type: "image" as const,

      src: "/expose-splash.png",
      alt: "Feature Image",
    },
  },
  {
    title: "Customize",
    short_description: "Customize your agent's appearance and voice",
    full_description:
      "You're ready to start building! Check out our comprehensive documentation and component examples to create your next amazing project.",
    media: {
      type: "image" as const,

      src: "/expose-splash.png",
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
      </ThirdwebProvider>
    </>
  );
}

export default App;
