"use client";

import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import React, { createContext, useContext, useMemo } from "react";

const STORAGE_KEY = "indexfast-color-mode";

interface ColorModeContextValue {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

function createAppTheme(mode: PaletteMode) {
  const isDark = mode === "dark";

  return responsiveFontSizes(
    createTheme({
      palette: {
        mode,
        primary: {
          main: "#7C3AED",
          light: "#A78BFA",
          dark: "#5B21B6",
        },
        secondary: {
          main: "#FACC15",
          light: "#FDE68A",
          dark: "#D97706",
        },
        background: {
          default: isDark ? "#0F0B1A" : "#ffffff",
          paper: isDark ? "#181026" : "#F5F3FF",
        },
        text: {
          primary: isDark ? "#F3F0FF" : "#1F2937",
          secondary: isDark ? "#B2A9CC" : "#6B7280",
        },
        divider: isDark ? "rgba(167, 139, 250, 0.22)" : "rgba(124, 58, 237, 0.14)",
      },
      typography: {
        fontFamily: '"Outfit", "Inter", sans-serif',
        h1: { fontWeight: 800, letterSpacing: "-0.02em" },
        h2: { fontWeight: 800, letterSpacing: "-0.02em" },
        h3: { fontWeight: 700 },
        button: { textTransform: "none", fontWeight: 700 },
      },
      shape: {
        borderRadius: 24,
      },
      shadows: [
        "none",
        isDark ? "0px 2px 4px rgba(0, 0, 0, 0.35)" : "0px 2px 4px rgba(124, 58, 237, 0.05)",
        isDark ? "0px 4px 8px rgba(0, 0, 0, 0.4)" : "0px 4px 8px rgba(124, 58, 237, 0.08)",
        isDark ? "0px 8px 16px rgba(0, 0, 0, 0.45)" : "0px 8px 16px rgba(124, 58, 237, 0.1)",
        isDark ? "0px 12px 24px rgba(0, 0, 0, 0.5)" : "0px 12px 24px rgba(124, 58, 237, 0.12)",
        isDark ? "0px 16px 32px rgba(0, 0, 0, 0.55)" : "0px 16px 32px rgba(124, 58, 237, 0.14)",
        ...Array(19).fill("none"),
      ] as any,
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 9999,
              padding: "12px 28px",
              boxShadow: "none",
              "&:hover": {
                boxShadow: isDark
                  ? "0 8px 20px rgba(124, 58, 237, 0.35)"
                  : "0 8px 20px rgba(124, 58, 237, 0.2)",
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow: isDark ? "0 10px 30px rgba(0, 0, 0, 0.45)" : "0 10px 30px rgba(124, 58, 237, 0.08)",
              border: "none",
            },
          },
        },
      },
    })
  );
}

function resolveInitialMode(): PaletteMode {
  if (typeof window === "undefined") return "light";

  const savedMode = window.localStorage.getItem(STORAGE_KEY);
  if (savedMode === "light" || savedMode === "dark") {
    return savedMode;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useColorMode() {
  const context = useContext(ColorModeContext);

  if (!context) {
    throw new Error("useColorMode must be used inside ThemeRegistry");
  }

  return context;
}

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<PaletteMode>("light");

  React.useEffect(() => {
    setMode(resolveInitialMode());
  }, []);

  React.useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => setMode((prevMode) => (prevMode === "light" ? "dark" : "light")),
    }),
    [mode]
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <AppRouterCacheProvider options={{ key: "mui" }}>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AppRouterCacheProvider>
  );
}
