import React, { useState } from "react";

import { IntroDisclosure } from "@/components/ui/intro-disclosure";

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
interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  actionButton?: React.ReactNode;
  promptInput?: React.ReactNode; // NEW
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  children,
  actionButton,
  promptInput,
}) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex flex-col h-full" data-aos="fade-in">
      <IntroDisclosure
        steps={steps}
        featureId="my-feature"
        onComplete={() => setOpen(false)}
        onSkip={() => setOpen(false)}
        setOpen={setOpen}
        open={open}
      />
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-scroll px-4 py-4">
        {/* Header */}
        <div className="shrink-0 text-center p-4">
          <h1 className="text-2xl font-bold text-[theme(colors.text.primary)]">
            {title}
          </h1>
        </div>

        {children}
      </div>

      {/* Prompt Input (optional) */}
      {promptInput && (
        <div className="shrink-0 sticky bottom-0 px-4 py-4 border-t border-[theme(colors.separator.primary)] z-10">
          {promptInput}
        </div>
      )}

      {/* Action Button (optional) */}
      {actionButton && (
        <div className="shrink-0 sticky bottom-0 px-4 py-4 border-t border-[theme(colors.separator.primary)] z-10">
          {actionButton}
        </div>
      )}
    </div>
  );
};
