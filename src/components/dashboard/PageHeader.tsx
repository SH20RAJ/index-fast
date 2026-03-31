import { Box, Stack, Typography } from "@mui/material";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "flex-end" }}
      spacing={{ xs: 2, sm: 0 }}
    >
      <Box>
        <Typography variant="h3" fontWeight={900} color="#111827" sx={{ mb: 1, fontSize: { xs: "2rem", sm: "2.4rem", md: "3rem" } }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </Box>
      {action ? <Box sx={{ width: { xs: "100%", sm: "auto" } }}>{action}</Box> : null}
    </Stack>
  );
}