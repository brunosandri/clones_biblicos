import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17201d",
        parchment: "#f7f1e4",
        cedar: "#5d4037",
        olive: "#59683f",
        gold: "#b78937",
        clay: "#a65f3b"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 32, 29, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
