import { stackServerApp } from "@/stack";
import { 
  Box, 
  Typography, 
  Breadcrumbs, 
  Link as MuiLink,
  Paper,
} from "@mui/material";
import Link from "next/link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import GscImportList from "@/components/GscImportList";

export default async function ImportSitePage() {
  await stackServerApp.getUser({ or: "redirect" });

  return (
    <Box>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 2 }}
      >
        <MuiLink underline="hover" color="inherit" component={Link} href="/dashboard">
          Dashboard
        </MuiLink>
        <Typography color="text.primary">Import from GSC</Typography>
      </Breadcrumbs>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Import from Google Search Console
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        We found these websites in your Search Console account. Select the ones you want to start indexing.
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 800 }}>
        <GscImportList />
      </Paper>
    </Box>
  );
}
