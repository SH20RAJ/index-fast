import { Box, Card, CardContent, Stack, Typography, alpha } from "@mui/material";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  trend?: string;
  trendType?: "up" | "down";
}

export default function StatsCard({ title, value, icon, color, trend, trendType }: StatsCardProps) {
  return (
    <Card
      sx={{
        borderRadius: "18px",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "none",
        bgcolor: "background.paper",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "14px",
                bgcolor: alpha(color, 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: color,
              }}
            >
              {icon}
            </Box>
            {trend && (
              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: "9999px",
                  bgcolor: trendType === "up" ? alpha("#10B981", 0.1) : alpha("#EF4444", 0.1),
                  color: trendType === "up" ? "#059669" : "#DC2626",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                }}
              >
                {trend}
              </Box>
            )}
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={900} color="text.primary">
              {value}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
