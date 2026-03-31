import { stackServerApp } from "@/stack";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Stack, 
  Avatar
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Fallback to Grid if Grid2 has issues
import AddIcon from "@mui/icons-material/Add";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import SpeedIcon from "@mui/icons-material/Speed";
import PublicIcon from "@mui/icons-material/Public";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import { db } from "@/db";
import { sites as sitesTable } from "@/db/schema/sites";
import { eq, desc } from "drizzle-orm";
import SiteList from "@/components/SiteList";

export default async function DashboardPage() {
  const user = await stackServerApp.getUser({ or: "redirect" });

  const userSites = await db.query.sites.findMany({
    where: eq(sitesTable.ownerId, user.id),
    orderBy: [desc(sitesTable.createdAt)],
  });

  const totalSites = userSites.length;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Welcome back, {user?.displayName || user?.primaryEmail}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your websites and automate your SEO indexing.
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            startIcon={<ImportExportIcon />} 
            href="/dashboard/sites/import"
            sx={{ borderRadius: 2 }}
          >
            Import GSC
          </Button>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            href="/dashboard/sites/new"
            sx={{ borderRadius: 2 }}
          >
            Add Site
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, border: "1px solid rgba(255,255,255,0.1)" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "primary.main" }}><PublicIcon /></Avatar>
                <Box>
                  <Typography variant="h6">Total Sites</Typography>
                  <Typography variant="h4" fontWeight="bold">{totalSites}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, border: "1px solid rgba(255,255,255,0.1)" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "secondary.main" }}><QueryStatsIcon /></Avatar>
                <Box>
                  <Typography variant="h6">URLs Indexed</Typography>
                  <Typography variant="h4" fontWeight="bold">0</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, border: "1px solid rgba(255,255,255,0.1)" }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: "info.main" }}><SpeedIcon /></Avatar>
                <Box>
                  <Typography variant="h6">Submissions Today</Typography>
                  <Typography variant="h4" fontWeight="bold">0</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 6 }}>
        {totalSites > 0 ? (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>Monitored Websites</Typography>
            <SiteList sites={userSites as any[]} />
          </>
        ) : (
          <Box sx={{ p: 4, borderRadius: 4, bgcolor: "background.paper", textAlign: "center", border: "1px dashed rgba(255,255,255,0.2)" }}>
            <Typography variant="h5" color="text.secondary" gutterBottom>No indexing activity yet.</Typography>
            <Button variant="outlined" href="/dashboard/sites/import" startIcon={<ImportExportIcon />} sx={{ mt: 2 }}>Import from Search Console</Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
