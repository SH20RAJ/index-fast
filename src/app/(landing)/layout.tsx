import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,hsl(var(--primary)/0.14),transparent_50%)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,hsl(var(--primary)/0.22),transparent_55%)]"
        aria-hidden
      />
      <Navbar />
      <main className="relative z-10 flex-1 pb-10">{children}</main>
      <Footer />
    </div>
  );
}
