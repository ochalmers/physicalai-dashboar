/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "var(--dark)",
        papaya: {
          500: "var(--papaya-500)",
          600: "var(--papaya-600)",
        },
        "text-heading": "var(--text-default-heading)",
        "text-body": "var(--text-default-body)",
        "surface-page": "var(--surface-page)",
        "surface-default": "var(--surface-default)",
        "border-default": "var(--border-default-secondary)",
        success: "var(--text-success-default)",
        error: "var(--text-error-default)",
      },
      fontFamily: {
        sans: ["PP Neue Montreal", "sans-serif"],
      },
      spacing: {
        s100: "var(--s-100)",
        s200: "var(--s-200)",
        s300: "var(--s-300)",
        s400: "var(--s-400)",
        s500: "var(--s-500)",
        s600: "var(--s-600)",
        s800: "var(--s-800)",
      },
      borderRadius: {
        br100: "var(--br-100)",
        br200: "var(--br-200)",
      },
      transitionDuration: {
        250: "250ms",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        summaryRing: {
          "0%": { boxShadow: "0 0 0 0 color-mix(in srgb, var(--papaya-500) 0%, transparent)" },
          "35%": { boxShadow: "0 0 0 4px color-mix(in srgb, var(--papaya-500) 28%, transparent)" },
          "100%": { boxShadow: "0 0 0 0 color-mix(in srgb, var(--papaya-500) 0%, transparent)" },
        },
      },
      animation: {
        summaryRing: "summaryRing 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
