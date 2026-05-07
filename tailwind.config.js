/** @type {import('tailwindcss').Config} */

const palette = (base, dark, darker, light, lighter) => ({
  base,
  dark,
  darker: darker ?? dark,
  light,
  lighter,
});

const SEMANTIC = {
  success: palette("#10B981", "#047857", "#065F46", "#34D399", "#1C2A24"),
  error: palette("#F43F5E", "#BE123C", "#881337", "#FB7185", "#2A1820"),
  warning: palette("#F59E0B", "#B45309", "#78350F", "#FBBF24", "#2A2017"),
  information: palette("#3B82F6", "#1D4ED8", "#1E3A8A", "#60A5FA", "#172139"),
  feature: palette("#8B5CF6", "#5B21B6", "#3B0764", "#A78BFA", "#1F1A2E"),
  highlighted: palette("#EC4899", "#9D174D", "#500724", "#F472B6", "#291520"),
  away: palette("#F97316", "#9A3412", "#431407", "#FB923C", "#2A1A12"),
  stable: palette("#22C55E", "#15803D", "#14532D", "#4ADE80", "#1A2A1F"),
  verified: palette("#14B8A6", "#0F766E", "#134E4A", "#2DD4BF", "#142A28"),
  faded: palette("#9CA3AF", "#6B7280", "#374151", "#D1D5DB", "#1A1D24"),
};

module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        // BeemoBot legacy tokens
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        border: "var(--border)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-gold": "var(--accent-gold)",
        danger: "var(--danger)",

        // AlignUI — bg scale (page surfaces)
        "bg-white-0": "#0B0D12",
        "bg-weak-50": "#151821",
        "bg-soft-200": "#1B1F2B",
        "bg-sub-300": "#262A36",
        "bg-surface-800": "#2A2F3D",
        "bg-strong-950": "#E8EAF0",

        // AlignUI — text scale
        "text-white-0": "#FFFFFF",
        "text-disabled-300": "#6B7280",
        "text-soft-400": "#9AA0B0",
        "text-sub-600": "#C1C5D0",
        "text-strong-950": "#E8EAF0",

        // AlignUI — stroke scale
        "stroke-white-0": "#0B0D12",
        "stroke-soft-200": "#262A36",
        "stroke-sub-300": "#2F3441",
        "stroke-strong-950": "#E8EAF0",

        // AlignUI — primary
        "primary-base": "#3B82F6",
        "primary-dark": "#2563EB",
        "primary-darker": "#1D4ED8",
        "primary-light": "#60A5FA",
        "primary-lighter": "#172139",
        "primary-alpha-10": "rgba(59,130,246,0.10)",
        "primary-alpha-16": "rgba(59,130,246,0.16)",
        "primary-alpha-24": "rgba(59,130,246,0.24)",

        // AlignUI — semantic
        "success-base": SEMANTIC.success.base,
        "success-dark": SEMANTIC.success.dark,
        "success-darker": SEMANTIC.success.darker,
        "success-light": SEMANTIC.success.light,
        "success-lighter": SEMANTIC.success.lighter,

        "error-base": SEMANTIC.error.base,
        "error-dark": SEMANTIC.error.dark,
        "error-darker": SEMANTIC.error.darker,
        "error-light": SEMANTIC.error.light,
        "error-lighter": SEMANTIC.error.lighter,
        "red-alpha-10": "rgba(244,63,94,0.10)",

        "warning-base": SEMANTIC.warning.base,
        "warning-dark": SEMANTIC.warning.dark,
        "warning-darker": SEMANTIC.warning.darker,
        "warning-light": SEMANTIC.warning.light,
        "warning-lighter": SEMANTIC.warning.lighter,

        "information-base": SEMANTIC.information.base,
        "information-dark": SEMANTIC.information.dark,
        "information-darker": SEMANTIC.information.darker,
        "information-light": SEMANTIC.information.light,
        "information-lighter": SEMANTIC.information.lighter,

        "feature-base": SEMANTIC.feature.base,
        "feature-dark": SEMANTIC.feature.dark,
        "feature-darker": SEMANTIC.feature.darker,
        "feature-light": SEMANTIC.feature.light,
        "feature-lighter": SEMANTIC.feature.lighter,

        "highlighted-base": SEMANTIC.highlighted.base,
        "highlighted-dark": SEMANTIC.highlighted.dark,
        "highlighted-darker": SEMANTIC.highlighted.darker,
        "highlighted-light": SEMANTIC.highlighted.light,
        "highlighted-lighter": SEMANTIC.highlighted.lighter,

        "away-base": SEMANTIC.away.base,
        "away-dark": SEMANTIC.away.dark,
        "away-darker": SEMANTIC.away.darker,
        "away-light": SEMANTIC.away.light,
        "away-lighter": SEMANTIC.away.lighter,

        "stable-base": SEMANTIC.stable.base,
        "stable-dark": SEMANTIC.stable.dark,
        "stable-darker": SEMANTIC.stable.darker,
        "stable-light": SEMANTIC.stable.light,
        "stable-lighter": SEMANTIC.stable.lighter,

        "verified-base": SEMANTIC.verified.base,
        "verified-dark": SEMANTIC.verified.dark,
        "verified-darker": SEMANTIC.verified.darker,
        "verified-light": SEMANTIC.verified.light,
        "verified-lighter": SEMANTIC.verified.lighter,

        "faded-base": SEMANTIC.faded.base,
        "faded-dark": SEMANTIC.faded.dark,
        "faded-darker": SEMANTIC.faded.darker,
        "faded-light": SEMANTIC.faded.light,
        "faded-lighter": SEMANTIC.faded.lighter,

        // Static (theme-independent)
        "static-white": "#FFFFFF",
        "static-black": "#000000",
        "white-alpha-16": "rgba(255,255,255,0.16)",
        "white-alpha-24": "rgba(255,255,255,0.24)",

        // Misc
        overlay: "rgba(0,0,0,0.6)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        sm: "4px",
        md: "var(--radius)",
        lg: "12px",
        10: "10px",
        20: "20px",
      },
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
      },
      fontSize: {
        // AlignUI titles
        "title-h1": ["56px", { lineHeight: "64px", letterSpacing: "-0.02em", fontWeight: "500" }],
        "title-h2": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "500" }],
        "title-h3": ["40px", { lineHeight: "48px", letterSpacing: "-0.015em", fontWeight: "500" }],
        "title-h4": ["32px", { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "500" }],
        "title-h5": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "500" }],
        "title-h6": ["20px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "500" }],

        // AlignUI labels (semibold-ish)
        "label-2xs": ["11px", { lineHeight: "12px", fontWeight: "500" }],
        "label-xs": ["12px", { lineHeight: "16px", fontWeight: "500" }],
        "label-sm": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "label-md": ["16px", { lineHeight: "24px", fontWeight: "500" }],
        "label-lg": ["18px", { lineHeight: "24px", fontWeight: "500" }],
        "label-xl": ["20px", { lineHeight: "28px", fontWeight: "500" }],

        // AlignUI paragraphs
        "paragraph-xs": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "paragraph-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "paragraph-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "paragraph-lg": ["18px", { lineHeight: "24px", fontWeight: "400" }],
        "paragraph-xl": ["20px", { lineHeight: "28px", fontWeight: "400" }],

        // AlignUI subheadings (uppercase)
        "subheading-2xs": ["11px", { lineHeight: "12px", letterSpacing: "0.06em", fontWeight: "500" }],
        "subheading-xs": ["12px", { lineHeight: "16px", letterSpacing: "0.06em", fontWeight: "500" }],
        "subheading-sm": ["14px", { lineHeight: "20px", letterSpacing: "0.06em", fontWeight: "500" }],
        "subheading-md": ["16px", { lineHeight: "20px", letterSpacing: "0.06em", fontWeight: "500" }],

        // AlignUI doc tokens
        "doc-label": ["14px", { lineHeight: "20px", fontWeight: "500" }],
        "doc-paragraph": ["14px", { lineHeight: "20px", fontWeight: "400" }],
      },
      boxShadow: {
        "regular-xs": "0 1px 2px 0 rgba(0,0,0,0.45)",
        "regular-sm": "0 2px 4px 0 rgba(0,0,0,0.40)",
        "regular-md": "0 4px 8px 0 rgba(0,0,0,0.35)",
        "regular-lg": "0 8px 16px 0 rgba(0,0,0,0.30)",
        complex: "0 16px 40px -12px rgba(0,0,0,0.55), 0 4px 8px 0 rgba(0,0,0,0.25)",
        "complex-md": "0 8px 24px -8px rgba(0,0,0,0.50)",
        "complex-7": "0 1px 2px 0 rgba(0,0,0,0.4), 0 8px 22px -6px rgba(59,130,246,0.45)",
        "custom-md": "0 12px 32px -10px rgba(0,0,0,0.55)",
        "custom-input": "inset 0 0 0 1px rgba(38,42,54,1), 0 1px 2px 0 rgba(0,0,0,0.45)",
        "custom-input-2": "inset 0 0 0 1px rgba(38,42,54,1)",
        "fancy-buttons-primary":
          "inset 0 1px 0 0 rgba(255,255,255,0.16), 0 1px 2px 0 rgba(0,0,0,0.5), 0 8px 16px -4px rgba(59,130,246,0.4)",
        "fancy-buttons-stroke":
          "inset 0 1px 0 0 rgba(255,255,255,0.06), 0 1px 2px 0 rgba(0,0,0,0.5)",
        "fancy-buttons-neutral":
          "inset 0 1px 0 0 rgba(255,255,255,0.08), 0 1px 2px 0 rgba(0,0,0,0.5)",
        "fancy-buttons-error":
          "inset 0 1px 0 0 rgba(255,255,255,0.16), 0 1px 2px 0 rgba(0,0,0,0.5), 0 8px 16px -4px rgba(244,63,94,0.45)",
        "toggle-switch": "0 1px 2px 0 rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        "button-defaults": "0 1px 2px 0 rgba(0,0,0,0.5)",
        "button-important-focus": "0 0 0 4px rgba(59,130,246,0.35)",
        "button-error-focus": "0 0 0 4px rgba(244,63,94,0.35)",
      },
      spacing: {
        4.5: "1.125rem",
        5.5: "1.375rem",
        6.5: "1.625rem",
        13.5: "3.375rem",
        20.5: "5.125rem",
        44.5: "11.125rem",
        160: "40rem",
      },
    },
  },
  plugins: [],
};
