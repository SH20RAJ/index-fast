import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

export const designSystem = {
  fonts: {
    sans: 'var(--font-sans), "Inter", sans-serif',
    display: 'var(--font-sans), "Inter", sans-serif',
  },
  colors: {
    light: {
      background: "#FFFFFF",
      paper: "#FFFFFF",
      text: "#0F172A",
      textSecondary: "#475569",
      border: "#E5E7EB",
      primary: "#111111",
      secondary: "#2563EB",
    },
    dark: {
      background: "#020617",
      paper: "#0F172A",
      text: "#F8FAFC",
      textSecondary: "#94A3B8",
      border: "rgba(255, 255, 255, 0.1)",
      primary: "#FFFFFF",
      secondary: "#38BDF8",
    },
  },
  radii: {
    card: 12,
    panel: 16,
    pill: 9999,
  },
  shadows: {
    light: [
      "none",
      "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
      "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      ...Array(19).fill("none"),
    ],
    dark: [
      "none",
      "0 1px 2px 0 rgb(0 0 0 / 0.3)",
      "0 1px 3px 0 rgb(0 0 0 / 0.4)",
      "0 4px 6px -1px rgb(0 0 0 / 0.4)",
      "0 10px 15px -3px rgb(0 0 0 / 0.5)",
      "0 20px 25px -5px rgb(0 0 0 / 0.6)",
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
        },
        secondary: {
          main: palette.secondary,
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
        h1: { fontWeight: 800, letterSpacing: "-0.04em" },
        h2: { fontWeight: 800, letterSpacing: "-0.03em" },
        h3: { fontWeight: 700, letterSpacing: "-0.02em" },
        h4: { fontWeight: 700, letterSpacing: "-0.02em" },
        h5: { fontWeight: 600, letterSpacing: "-0.01em" },
        h6: { fontWeight: 600 },
        button: { textTransform: "none", fontWeight: 600 },
        body1: { fontSize: "1rem", lineHeight: 1.6 },
        body2: { fontSize: "0.875rem", lineHeight: 1.6 },
      },
      shape: {
        borderRadius: 8,
      },
      shadows: (isDark ? designSystem.shadows.dark : designSystem.shadows.light) as any,
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: "8px",
              padding: "10px 20px",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
            },
            contained: {
              backgroundColor: palette.primary,
              color: isDark ? "#000000" : "#FFFFFF",
              "&:hover": {
                backgroundColor: isDark ? "#E5E7EB" : "#2B2B2B",
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: designSystem.radii.card,
              border: `1px solid ${palette.border}`,
              boxShadow: "none",
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow: "none",
              border: `1px solid ${palette.border}`,
            },
          },
        },
      },
    })
  );
}
