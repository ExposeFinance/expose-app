import { ReactNode, useEffect, useState } from "react";
import Loader from "@/components/ui/loader";
import NavBar from "@/components/ui/nav";
import AOS from "aos";
import "aos/dist/aos.css";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);

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
          href="https://fonts.googleapis.com/css2?family=Overpass:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      {isLoading ? (
        <div className="flex items-center justify-center h-dvh bg-background-primary">
          <Loader />
        </div>
      ) : (
        // Use min-h-screen so the container is at least the height of the viewport.
        <div className="h-dvh flex flex-col bg-background-primary">
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
