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

import { Account, privateKeyToAccount } from "thirdweb/wallets";
import { client } from "../thirdweb/thirdwebClient.js";

export const account: Account = privateKeyToAccount({
  client: client,
  privateKey: process.env.PRIVATE_KEY!,
});
