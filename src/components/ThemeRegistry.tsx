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
          main: "#0EA5E9",
          light: "#38BDF8",
          dark: "#0284C7",
        },
        secondary: {
          main: "#14B8A6",
          light: "#2DD4BF",
          dark: "#0F766E",
        },
        background: {
          default: isDark ? "#0B1220" : "#F8FAFC",
          paper: isDark ? "#101A2F" : "#FFFFFF",
        },
        text: {
          primary: isDark ? "#E6EEF8" : "#0F172A",
          secondary: isDark ? "#A8B5C7" : "#475569",
        },
        divider: isDark ? "rgba(148, 163, 184, 0.22)" : "rgba(15, 23, 42, 0.12)",
      },
      typography: {
        fontFamily: '"Outfit", "Inter", sans-serif',
        h1: { fontWeight: 800, letterSpacing: "-0.02em" },
        h2: { fontWeight: 800, letterSpacing: "-0.02em" },
        h3: { fontWeight: 700 },
        button: { textTransform: "none", fontWeight: 700 },
      },
      shape: {
        borderRadius: 18,
      },
      shadows: [
        "none",
        isDark ? "0px 2px 4px rgba(2, 6, 23, 0.35)" : "0px 2px 4px rgba(15, 23, 42, 0.05)",
        isDark ? "0px 4px 8px rgba(2, 6, 23, 0.4)" : "0px 4px 8px rgba(15, 23, 42, 0.08)",
        isDark ? "0px 8px 16px rgba(2, 6, 23, 0.45)" : "0px 8px 16px rgba(15, 23, 42, 0.1)",
        isDark ? "0px 12px 24px rgba(2, 6, 23, 0.5)" : "0px 12px 24px rgba(15, 23, 42, 0.12)",
        isDark ? "0px 16px 32px rgba(2, 6, 23, 0.55)" : "0px 16px 32px rgba(15, 23, 42, 0.14)",
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
                  ? "0 8px 20px rgba(14, 165, 233, 0.28)"
                  : "0 8px 20px rgba(14, 165, 233, 0.18)",
              },
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              boxShadow: isDark ? "0 10px 30px rgba(2, 6, 23, 0.42)" : "0 10px 30px rgba(15, 23, 42, 0.08)",
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
