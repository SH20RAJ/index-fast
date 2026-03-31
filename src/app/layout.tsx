import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { StackProvider } from "@stackframe/stack";
import { stackServerApp } from "@/stack";
import ThemeRegistry from "@/components/ThemeRegistry";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IndexFast | Automated SEO Indexing",
  description: "Submit your URLs to Google, Bing, and IndexNow instantly. No AI bloat, just speed.",
  metadataBase: new URL("https://indexfast.net"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: "IndexFast | Automated SEO Indexing",
    description: "Submit your URLs to Google, Bing, and IndexNow instantly.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StackProvider app={stackServerApp}>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col">
          <ThemeRegistry>{children}</ThemeRegistry>
        </body>
      </html>
    </StackProvider>
  );
}
