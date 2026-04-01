import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

export const designSystem = {
  fonts: {
    sans: '"Outfit", "Manrope", sans-serif',
    display: '"Manrope", "Outfit", sans-serif',
  },
  colors: {
    light: {
      background: "#F8FAFC",
      paper: "#FFFFFF",
      text: "#0F172A",
      textSecondary: "#475569",
      border: "rgba(15, 23, 42, 0.10)",
      primary: "#111111",
      secondary: "#2563EB",
    },
    dark: {
      background: "#050816",
      paper: "#0B1020",
      text: "#E5E7EB",
      textSecondary: "#94A3B8",
      border: "rgba(148, 163, 184, 0.18)",
      primary: "#FFFFFF",
      secondary: "#60A5FA",
    },
  },
  radii: {
    card: 24,
    panel: 32,
    pill: 9999,
  },
  shadows: {
    light: [
      "none",
      "0px 2px 4px rgba(15, 23, 42, 0.05)",
      "0px 4px 8px rgba(15, 23, 42, 0.07)",
      "0px 8px 16px rgba(15, 23, 42, 0.09)",
      "0px 12px 24px rgba(15, 23, 42, 0.10)",
      "0px 16px 32px rgba(15, 23, 42, 0.12)",
      ...Array(19).fill("none"),
    ],
    dark: [
      "none",
      "0px 2px 4px rgba(2, 6, 23, 0.35)",
      "0px 4px 8px rgba(2, 6, 23, 0.4)",
      "0px 8px 16px rgba(2, 6, 23, 0.45)",
      "0px 12px 24px rgba(2, 6, 23, 0.5)",
      "0px 16px 32px rgba(2, 6, 23, 0.55)",
      ...Array(19).fill("none"),
    ],
  },
} as const;

export function createDesignTheme(mode: PaletteMode) {
  const isDark = mode === "dark";
  const palette = isDark ? designSystem.colors.dark : designSystem.colors.light;

  return responsiveFontSizes(
    createTheme({
      palette: {
        mode,
        primary: {
          main: palette.primary,
          light: isDark ? "#F8FAFC" : "#2B2B2B",
          dark: isDark ? "#CBD5E1" : "#000000",
        },
        secondary: {
          main: palette.secondary,
          light: isDark ? "#93C5FD" : "#3B82F6",
          dark: isDark ? "#2563EB" : "#1D4ED8",
        },
        background: {
          default: palette.background,
          paper: palette.paper,
        },
        text: {
          primary: palette.text,
          secondary: palette.textSecondary,
        },
        divider: palette.border,
      },
      typography: {
        fontFamily: designSystem.fonts.sans,
        h1: { fontWeight: 800, letterSpacing: "-0.03em" },
        h2: { fontWeight: 800, letterSpacing: "-0.03em" },
        h3: { fontWeight: 750, letterSpacing: "-0.02em" },
        h4: { fontWeight: 700, letterSpacing: "-0.02em" },
        h5: { fontWeight: 700, letterSpacing: "-0.01em" },
        h6: { fontWeight: 600 },
        button: { textTransform: "none", fontWeight: 700 },
        overline: { letterSpacing: "0.14em", fontWeight: 800 },
      },
      shape: {
        borderRadius: 18,
      },
      shadows: (isDark ? designSystem.shadows.dark : designSystem.shadows.light) as any,
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: designSystem.radii.pill,
              padding: "12px 24px",
              boxShadow: "none",
              letterSpacing: "-0.01em",
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow: isDark ? "0 10px 30px rgba(2, 6, 23, 0.34)" : "0 10px 30px rgba(15, 23, 42, 0.06)",
              border: "none",
            },
          },
        },
      },
    })
  );
}
