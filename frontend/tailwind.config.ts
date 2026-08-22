import type { Config } from "tailwindcss";

/**
 * GlobeTrotter design system.
 *
 * Operate-mode product UI: a fixed rem type scale (not fluid), a tight ~1.15
 * ratio so the many UI text elements stay distinguishable without shouting,
 * and a warm sandstone neutral ramp that ties the chrome to the Jaipur palette
 * instead of defaulting to cool grey.
 */
const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316", // Regal saffron / terracotta
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
        },
        jaipur: {
          pink: "#E85D75",
          sandstone: "#D87D4A",
          gold: "#E0A96D",
          royal: "#1B2A4A",
        },
        /**
         * Warm neutral ramp. Replaces cool slate for chrome and text so the
         * interface reads as sunlit sandstone rather than generic dashboard.
         */
        sand: {
          50: "#FAF8F5",
          100: "#F4F0EA",
          200: "#E8E1D7",
          300: "#D6CCBE",
          400: "#A99C8B",
          500: "#7D7264",
          600: "#5C5348",
          700: "#443D35",
          800: "#2C2721",
          900: "#1A1613",
        },
        // Semantic state vocabulary. Standardized so the same meaning always
        // gets the same colour, instead of ad-hoc emerald/blue/purple.
        success: { 50: "#ECFDF5", 500: "#10B981", 600: "#059669", 700: "#047857" },
        warning: { 50: "#FFFBEB", 500: "#F59E0B", 600: "#D97706", 700: "#B45309" },
        danger: { 50: "#FEF2F2", 500: "#EF4444", 600: "#DC2626", 700: "#B91C1C" },
        info: { 50: "#EFF6FF", 500: "#3B82F6", 600: "#2563EB", 700: "#1D4ED8" },
      },
      /**
       * Fixed scale, ~1.15 ratio. `xs` is lifted from Tailwind's 12px to 13px
       * and `sm` to 14px: this workspace sets nearly all of its content at
       * those two steps, and 12px was below comfortable reading size.
       */
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.01em" }],
        xs: ["0.8125rem", { lineHeight: "1.125rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["0.9375rem", { lineHeight: "1.4rem" }],
        lg: ["1.0625rem", { lineHeight: "1.5rem", letterSpacing: "-0.011em" }],
        xl: ["1.1875rem", { lineHeight: "1.6rem", letterSpacing: "-0.014em" }],
        "2xl": ["1.4375rem", { lineHeight: "1.8rem", letterSpacing: "-0.019em" }],
        "3xl": ["1.75rem", { lineHeight: "2.1rem", letterSpacing: "-0.022em" }],
        "4xl": ["2.125rem", { lineHeight: "2.4rem", letterSpacing: "-0.026em" }],
        "5xl": ["2.75rem", { lineHeight: "3rem", letterSpacing: "-0.03em" }],
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-outfit)", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        // Three steps carry the whole UI: controls, cards, containers.
        control: "0.625rem",
        card: "0.875rem",
        panel: "1.25rem",
      },
      boxShadow: {
        // Every level carries a real offset and blur; a zero-offset halo is
        // decoration, not depth. Tinted warm so shadows sit in the sand ramp.
        hairline: "0 1px 2px 0 rgb(68 61 53 / 0.06)",
        raised: "0 1px 2px 0 rgb(68 61 53 / 0.06), 0 2px 6px -1px rgb(68 61 53 / 0.08)",
        float: "0 2px 4px -1px rgb(68 61 53 / 0.06), 0 8px 20px -4px rgb(68 61 53 / 0.12)",
        overlay: "0 4px 8px -2px rgb(68 61 53 / 0.08), 0 20px 40px -8px rgb(68 61 53 / 0.18)",
      },
      transitionTimingFunction: {
        // Exponential ease-out: fast departure, settled arrival.
        exit: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
