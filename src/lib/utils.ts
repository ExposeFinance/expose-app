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

import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only use this if you're okay with exposing the key client-side
});