import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0c1014",
        night: "#12151b",
        atlas: "#d7b978",
        brass: "#caa24b",
        ember: "#9f4234",
        turquoise: "#3aa6a1",
        moss: "#748b54"
      },
      boxShadow: {
        glow: "0 0 40px rgba(202, 162, 75, 0.18)"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
