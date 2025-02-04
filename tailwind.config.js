/**
 * Autogenerated file. Generated at 28/01/2025, 5:56:17 pm.
 * Do not edit!
 */

/** @type {import('tailwindcss').Config} */

import base from "./tailwind.base.js";

export default {
  // Merge or override the base darkMode if desired
  darkMode: base.darkMode,

  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  plugins: [
    // e.g. ...base.plugins if base had them
    // require("@tailwindcss/typography")
  ],

  theme: {
    // Spread everything from base.theme
    ...base.theme,

    extend: {
      ...(base.theme?.extend || {}),

      colors: {
        ...base.theme?.extend?.colors,
        "color-1": "hsl(var(--color-1))",
        "color-2": "hsl(var(--color-2))",
        "color-3": "hsl(var(--color-3))",
        "color-4": "hsl(var(--color-4))",
        "color-5": "hsl(var(--color-5))",
      },
      animation: {
        rainbow: "rainbow var(--speed, 2s) infinite linear",
      },
      keyframes: {
        rainbow: {
          "0%": {
            "background-position": "0%",
          },
          "100%": {
            "background-position": "200%",
          },
        },
      },
    },
  },
};
