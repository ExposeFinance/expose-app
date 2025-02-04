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

  // Set up the dynamic viewport height variable.
  useEffect(() => {
    const setVh = () => {
      // Calculate 1% of the viewport height
      const vh = window.innerHeight * 0.01;
      // Set the value in the --vh custom property on the root of the document
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };
    setVh();
    window.addEventListener("resize", setVh);
    return () => window.removeEventListener("resize", setVh);
  }, []);

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
      duration: 800,
      offset: 50,
      easing: "ease-in-out",
      once: true,
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
        <div className="flex items-center justify-center min-h-[calc(var(--vh, 1vh)*100)] bg-background-primary">
          <Loader />
        </div>
      ) : (
        // Use a container that is at least as tall as the dynamic viewport height.
        <div className="min-h-[calc(var(--vh, 1vh)*100)] flex flex-col bg-background-primary">
          {/* Main Content (Page Layout) */}
          <div className="flex-1 overflow-y-auto">{children}</div>

          {/* Navigation Bar */}
          {/* Since we're not using a fixed layout, the nav is part of the flex layout at the bottom */}
          <div className="shrink-0 shadow-md">
            <NavBar />
          </div>
        </div>
      )}
    </>
  );
}
