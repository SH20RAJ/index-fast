"use client";

import React, { createContext, useContext, useMemo } from "react";

type PaletteMode = "light" | "dark";

const STORAGE_KEY = "indexfast-color-mode";

interface ColorModeContextValue {
  mode: PaletteMode;
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null);

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
  const mounted = React.useRef(false);

  React.useEffect(() => {
    setMode(resolveInitialMode());
  }, []);

  React.useEffect(() => {
    // Don't overwrite localStorage on the initial render — wait until the
    // real mode has been resolved from storage/system preference first.
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");
  }, [mode]);

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => setMode((prevMode) => (prevMode === "light" ? "dark" : "light")),
    }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>{children}</ColorModeContext.Provider>
  );
}
