import { Stack, Typography } from "@mui/material";

interface PanelEmptyStateProps {
  icon: React.ReactNode;
  message: string;
  height?: number;
}

export default function PanelEmptyState({
  icon,
  message,
  height = 300,
}: PanelEmptyStateProps) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{ height, color: "text.secondary" }}
    >
      {icon}
      <Typography variant="body2">{message}</Typography>
    </Stack>
  );
}