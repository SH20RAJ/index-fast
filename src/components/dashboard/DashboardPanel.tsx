import { Box, Stack, Typography } from "@/components/ui/mui";

interface DashboardPanelProps {
  title: string;
  minHeight?: number;
  flex?: number;
  children: React.ReactNode;
}

export default function DashboardPanel({
  title,
  minHeight = 400,
  flex,
  children,
}: DashboardPanelProps) {
  return (
    <Box
      sx={{
        flex,
        p: 4,
        bgcolor: "white",
        borderRadius: "32px",
        border: "1px solid",
        borderColor: "rgba(0,0,0,0.05)",
        minHeight,
      }}
    >
      <Typography variant="h6" fontWeight={800} sx={{ mb: 3 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}