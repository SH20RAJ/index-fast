import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="relative z-10 flex-1 bg-background">
        {children}
      </main>
      <Footer />
    </div>
  );
}
