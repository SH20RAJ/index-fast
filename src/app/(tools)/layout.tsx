import { Box } from "@mui/material";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function ToolsGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
}