/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Map `@` to the `src` directory
    },
  },
  test: {
    globals: true, // Enable global APIs like `expect`, `describe`, `it`
    environment: "jsdom", // Use jsdom for DOM simulation
  },
});
