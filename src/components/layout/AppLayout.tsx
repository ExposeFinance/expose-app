import { ReactNode, useEffect, useState } from "react";
import Loader from "@/components/ui/loader";
import NavBar from "@/components/ui/nav";
import AOS from "aos";
import "aos/dist/aos.css";
import { getCssVariable } from "@/lib/utils";
import { useActiveAccount } from "thirdweb/react";
import { ConnectButton } from "thirdweb/react";
import { client } from "@/thirdweb/thirdwebClient";
import { sepolia } from "thirdweb/chains";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const account = useActiveAccount();
  const isWalletConnected = !!account;

  // Trigger the loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 800, // Animation duration
      offset: 50, // Distance from the viewport to trigger the animation
      easing: "ease-in-out", // Animation easing
      once: true, // Only animate once
      anchorPlacement: "top-bottom",
    });
  }, []);

  return (
    <>
      <head>
        <title>Expose</title>
        <meta
          name="description"
          content="Swap, send, borrow and lend crypto with just your voice!"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Overpass:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto:ital,wght@0,100..900&display=swap"
          rel="stylesheet"
        />
        <meta
          name="theme-color"
          content={getCssVariable("--colors-background-primary")}
          media="(prefers-color-scheme: light)"
        />
        <meta
          name="theme-color"
          content={getCssVariable("--colors-background-primary")}
          media="(prefers-color-scheme: dark)"
        />
      </head>

      {isLoading ? (
        <div className="flex items-center justify-center h-dvh bg-background-primary border-border-primary text-text-primary">
          <Loader />
        </div>
      ) : (
        <div className="h-dvh flex flex-col bg-background-primary">
          {/* Show Wallet Connect Overlay if wallet is NOT connected */}
          {!isWalletConnected && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              {/* Full-screen background overlay */}
              <div className="absolute inset-0 bg-background-primary"></div>

              {/* Wallet Connect Modal */}
              <div className="relative p-6 bg-surface-primary rounded-lg shadow-lg text-center flex flex-col items-center">
                <h2 className="text-xl font-bold mb-4">Login</h2>
                <ConnectButton
                  client={client}
                  accountAbstraction={{ chain: sepolia, sponsorGas: true }}
                />
              </div>
            </div>
          )}

          {/* Main Content: scrollable if needed */}
          <div className="flex-1 overflow-y-auto">{children}</div>

          {/* Navigation Bar at the bottom */}
          <div className="shrink-0 shadow-md">
            <NavBar />
          </div>
        </div>
      )}
    </>
  );
}
