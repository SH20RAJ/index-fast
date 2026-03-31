import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackClientApp } from "@/stack/client";
import ThemeRegistry from "@/components/ThemeRegistry";
import "./globals.css";

export const metadata: Metadata = {
  title: "IndexFast",
  description: "IndexFast App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StackProvider app={stackClientApp}>
          <StackTheme>
            <ThemeRegistry>{children}</ThemeRegistry>
          </StackTheme>
        </StackProvider>
      </body>
    </html>
  );
}
