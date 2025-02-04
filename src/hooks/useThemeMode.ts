import { useEffect, useState } from "react";

export function useThemeMode() {
  const getInitialTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [isThemeMode, setIsThemeMode] = useState<boolean>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    if (isThemeMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isThemeMode]);

  return [isThemeMode, setIsThemeMode] as const;
}
