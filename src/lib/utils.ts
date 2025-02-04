import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to get CSS variables from the current theme
export const getCssVariable = (variableName: string) => {
  const root = document.documentElement;
  return getComputedStyle(root)
    .getPropertyValue(variableName)
    .trim() as `#${string}`;
};

import { privateKeyToAccount } from "thirdweb/wallets";
import { client } from "../thirdweb/thirdwebClient.js";

export const account = privateKeyToAccount({
  client: client,
  privateKey: import.meta.env.VITE_PRIVATE_KEY,
});
