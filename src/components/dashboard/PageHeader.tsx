import { Box, Stack, Typography } from "@mui/material";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
      <Box>
        <Typography variant="h3" fontWeight={900} color="#111827" sx={{ mb: 1 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </Box>
      {action}
    </Stack>
  );
}