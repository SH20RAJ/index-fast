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
import AddSiteForm from "@/components/AddSiteForm";

export default async function NewSitePage() {
  const user = await stackServerApp.getUser({ or: "redirect" });

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
        <Typography color="text.primary">Add New Site</Typography>
      </Breadcrumbs>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Connect a New Website
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Enter your website details to start automated indexing.
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 600 }}>
        <AddSiteForm userId={user.id} />
      </Paper>
    </Box>
  );
}
