import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#07090d",
        graphite: "#11151d",
        mist: "#f4f6f8",
        line: "#dfe5ea",
        hnb: "#34f56f",
        cyanweb: "#15a8ff"
      },
      boxShadow: {
        glow: "0 0 36px rgba(52, 245, 111, 0.22)",
        soft: "0 24px 80px rgba(8, 13, 21, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
