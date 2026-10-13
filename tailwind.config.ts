import type { Config } from "tailwindcss";

// Tokens copied from the "Dignity Forward" design system (Stitch export).
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "on-secondary-container": "#541100", "on-primary-container": "#fffbff",
        "primary-fixed": "#ffd9df", "secondary-fixed": "#ffdbd1", "on-surface": "#1a1a2b",
        "on-primary-fixed-variant": "#90003e", "on-primary": "#ffffff",
        "secondary-fixed-dim": "#ffb5a0", "outline-variant": "#e4bdc3", secondary: "#b02f00",
        "error-container": "#ffdad6", "secondary-container": "#ff5722",
        "on-tertiary-fixed": "#211a1d", "surface-dim": "#dad8ef", "on-error-container": "#93000a",
        "surface-variant": "#e3e0f8", "on-error": "#ffffff", "on-background": "#1a1a2b",
        "inverse-primary": "#ffb1c1", "surface-container-high": "#e8e6fe",
        "surface-container-lowest": "#ffffff", "on-tertiary-fixed-variant": "#4e4448",
        "inverse-on-surface": "#f2efff", "surface-container": "#efecff",
        "on-surface-variant": "#5b3f45", "primary-container": "#e40468",
        "on-tertiary-container": "#fffbff", tertiary: "#63595d", "tertiary-fixed-dim": "#d1c3c8",
        "surface-container-low": "#f5f2ff", "surface-bright": "#fcf8ff",
        "on-primary-fixed": "#3f0017", "surface-tint": "#bb0054", primary: "#b70051",
        "tertiary-container": "#7d7276", "on-secondary": "#ffffff", outline: "#8f6f75",
        "on-tertiary": "#ffffff", "on-secondary-fixed": "#3b0900", "inverse-surface": "#2f2f41",
        "on-secondary-fixed-variant": "#862200", "primary-fixed-dim": "#ffb1c1",
        "tertiary-fixed": "#eddfe4", "surface-container-highest": "#e3e0f8", error: "#ba1a1a",
        background: "#fcf8ff", surface: "#fcf8ff",
      },
      borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
      spacing: {
        "gutter-mobile": "1rem", "margin-mobile": "1.25rem", "space-md": "1rem",
        "space-sm": "0.5rem", gutter: "1.5rem", "space-xl": "2.5rem", "space-xs": "0.25rem",
        "space-lg": "1.5rem", margin: "2rem",
      },
      fontFamily: {
        "headline-md": ["Plus Jakarta Sans", "sans-serif"], "headline-sm": ["Plus Jakarta Sans", "sans-serif"],
        "display-hero-mobile": ["Plus Jakarta Sans", "sans-serif"], "label-lg": ["Plus Jakarta Sans", "sans-serif"],
        "display-hero": ["Plus Jakarta Sans", "sans-serif"], "label-sm": ["Plus Jakarta Sans", "sans-serif"],
        "headline-lg": ["Plus Jakarta Sans", "sans-serif"], "label-md": ["Plus Jakarta Sans", "sans-serif"],
        "body-sm": ["Be Vietnam Pro", "sans-serif"], "headline-lg-mobile": ["Plus Jakarta Sans", "sans-serif"],
        "body-md": ["Be Vietnam Pro", "sans-serif"], "body-lg": ["Be Vietnam Pro", "sans-serif"],
      },
      fontSize: {
        "headline-md": ["28px", { lineHeight: "36px", fontWeight: "700" }],
        "headline-sm": ["22px", { lineHeight: "30px", fontWeight: "600" }],
        "display-hero-mobile": ["36px", { lineHeight: "44px", letterSpacing: "-0.01em", fontWeight: "800" }],
        "label-lg": ["15px", { lineHeight: "20px", letterSpacing: "0.02em", fontWeight: "700" }],
        "display-hero": ["56px", { lineHeight: "64px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "label-sm": ["11px", { lineHeight: "16px", letterSpacing: "0.08em", fontWeight: "800" }],
        "headline-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.015em", fontWeight: "700" }],
        "label-md": ["13px", { lineHeight: "18px", letterSpacing: "0.04em", fontWeight: "700" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "headline-lg-mobile": ["28px", { lineHeight: "36px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
      },
    },
  },
  plugins: [],
};
export default config;
