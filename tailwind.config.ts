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
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        graphite: "rgb(var(--color-graphite) / <alpha-value>)",
        mist: "rgb(var(--color-muted-surface) / <alpha-value>)",
        page: "rgb(var(--color-page) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        hnb: "rgb(var(--color-accent) / <alpha-value>)",
        cyanweb: "rgb(var(--color-cyan) / <alpha-value>)",
        mutedText: "rgb(var(--color-muted-text) / <alpha-value>)"
      },
      fontFamily: {
        sans: "var(--font-sans)"
      },
      boxShadow: {
        glow: "0 0 36px rgb(var(--color-accent) / 0.22)",
        soft: "0 24px 80px rgb(var(--color-ink) / 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
