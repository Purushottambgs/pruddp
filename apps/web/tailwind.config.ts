import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        // Pruddo brand — indigo primary
        brand: {
          DEFAULT: "#6366F1", // indigo-500
          hover: "#4F46E5",   // indigo-600
          light: "#EEF2FF",   // indigo-50
        },
        // Trust score tiers
        trust: {
          great: {
            DEFAULT: "#10B981", // emerald-500
            bg: "#ECFDF5",      // emerald-50
          },
          consider: {
            DEFAULT: "#F59E0B", // amber-500
            bg: "#FFFBEB",      // amber-50
          },
          avoid: {
            DEFAULT: "#EF4444", // red-500
            bg: "#FEF2F2",      // red-50
          },
        },
        // Price indicators
        price: {
          good: "#10B981",   // emerald-500
          bad: "#EF4444",    // red-500
          normal: "#334155", // slate-700
          chart: "#6366F1",  // indigo-500
        },
      },
      borderRadius: {
        card: "0.75rem",   // 12px
        button: "0.5rem",  // 8px
      },
    },
  },
  plugins: [],
};

export default config;
