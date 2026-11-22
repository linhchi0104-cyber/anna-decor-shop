import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: "#FFD6E0",
          pinkDark: "#FF8EAA",
          rose: "#FFB7B2",
          butter: "#FFF3B0",
          yellowGold: "#FFE699",
          mint: "#C1F0DC",
          mintDark: "#7EE7B8",
          lavender: "#E8D7F1",
          lavenderDark: "#BE9FE1",
          cream: "#FFFDF9",
          warmBg: "#FFF9F5",
          choco: "#5C3D2E",
          text: "#4A3E3D",
          subtext: "#7B6F72",
        },
      },
      fontFamily: {
        quicksand: ["var(--font-quicksand)", "sans-serif"],
        bubble: ["var(--font-baloo)", "cursive"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        kawaii: "0 8px 24px -4px rgba(255, 142, 170, 0.25)",
        "kawaii-sm": "0 4px 12px -2px rgba(255, 183, 178, 0.3)",
        "kawaii-hover": "0 14px 32px -4px rgba(255, 142, 170, 0.38)",
        "kawaii-mint": "0 8px 24px -4px rgba(126, 231, 184, 0.25)",
        "kawaii-lavender": "0 8px 24px -4px rgba(190, 159, 225, 0.3)",
        "kawaii-butter": "0 8px 24px -4px rgba(255, 230, 153, 0.35)",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "float-delayed": "float 3s ease-in-out 1.5s infinite",
        "wiggle-soft": "wiggle 2s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        sparkle: "sparkle 1.5s ease-in-out infinite",
        shake: "shake 0.4s ease-in-out",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-8px)" },
          "40%, 80%": { transform: "translateX(8px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.85)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
