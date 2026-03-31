"use client";

import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

// WonderKids Playful Theme
let theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7C3AED", // Violet 600
      light: "#A78BFA",
      dark: "#5B21B6",
    },
    secondary: {
      main: "#FACC15", // Amber 400
      light: "#FDE68A",
      dark: "#D97706",
    },
    background: {
      default: "#ffffff",
      paper: "#F5F3FF", // Very light purple
    },
    text: {
      primary: "#1F2937",
      secondary: "#6B7280",
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    h1: { fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontWeight: 800, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 700 },
  },
  shape: {
    borderRadius: 24, // Very rounded for the kids' feel
  },
  shadows: [
    "none",
    "0px 2px 4px rgba(124, 58, 237, 0.05)",
    "0px 4px 8px rgba(124, 58, 237, 0.08)",
    "0px 8px 16px rgba(124, 58, 237, 0.1)",
    "0px 12px 24px rgba(124, 58, 237, 0.12)",
    "0px 16px 32px rgba(124, 58, 237, 0.14)",
    ...Array(19).fill("none"),
  ] as any,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999, // Pill shaped buttons
          padding: "12px 28px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 8px 20px rgba(124, 58, 237, 0.2)",
            transform: "scale(1.02)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 10px 30px rgba(124, 58, 237, 0.08)",
          border: "none",
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
