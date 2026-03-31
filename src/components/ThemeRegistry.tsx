"use client";
import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4F46E5", // Elegant Indigo
    },
    secondary: {
      main: "#10B981", // Emerald Green
    },
    background: {
      default: "#0F172A", // Deep Navy
      paper: "#1E293B",
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
  },
});

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
