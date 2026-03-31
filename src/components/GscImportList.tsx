"use client";

import * as React from "react";
import { 
  Box, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Checkbox, 
  Button, 
  Typography, 
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Stack,
  ListItemButton
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useUser } from "@stackframe/stack";
import { fetchGscSites } from "@/app/actions/google";
import { addSite } from "@/app/actions/sites";

export default function GscImportList() {
  const user = useUser({ or: "redirect" });
  
  // Use the correct Stack Auth hook pattern for connected accounts
  const googleAccount = user.useConnectedAccounts().find(a => a.providerId === "google");
  
  const { accessToken } = googleAccount?.useAccessToken({
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  }) ?? { accessToken: null };

  const [loading, setLoading] = React.useState(true);
  const [importing, setImporting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [gscSites, setGscSites] = React.useState<{ url: string; isAdded: boolean }[]>([]);
  const [selectedUrls, setSelectedUrls] = React.useState<string[]>([]);

  React.useEffect(() => {
    async function loadSites() {
      if (!accessToken) {
        if (!googleAccount) setLoading(false);
        return;
      }

      const result = await fetchGscSites(accessToken);
      if (result.error) {
        setError(result.error);
      } else if (result.sites) {
        setGscSites(result.sites);
      }
      setLoading(false);
    }

    loadSites();
  }, [accessToken, googleAccount]);

  const toggleUrl = (url: string) => {
    setSelectedUrls((prev) => 
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  const handleImport = async () => {
    setImporting(true);
    let successCount = 0;

    for (const url of selectedUrls) {
      const formData = new FormData();
      formData.append("url", url);
      formData.append("sitemapUrl", `${url}/sitemap.xml`);
      
      const result = await addSite(formData, user.id);
      if (result && !('error' in result)) successCount++;
    }

    if (successCount > 0) {
      window.location.href = "/dashboard";
    } else {
      setImporting(false);
    }
  };

  if (!googleAccount) {
    return (
      <Alert severity="warning" sx={{ borderRadius: 3 }}>
        Google account is not connected. Please go to settings and connect your Google account.
      </Alert>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ borderRadius: 3 }}>
        {error}
        <Button sx={{ mt: 1, display: "block" }} onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Alert>
    );
  }

  const importableSites = gscSites.filter(s => !s.isAdded);

  return (
    <Box>
      {importableSites.length === 0 ? (
        <Typography color="text.secondary" sx={{ p: 2 }}>
          No new websites found in your Google Search Console.
        </Typography>
      ) : (
        <Stack spacing={3}>
          <Paper sx={{ maxHeight: 400, overflow: "auto", borderRadius: 3, border: "1px solid rgba(255,255,255,0.1)" }}>
            <List>
              {importableSites.map((site, index) => (
                <Box key={site.url}>
                  <ListItem disablePadding>
                    <ListItemButton 
                      onClick={() => toggleUrl(site.url)}
                      disabled={importing}
                      sx={{ py: 1 }}
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={selectedUrls.includes(site.url)}
                          tabIndex={-1}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemIcon>
                        <LanguageIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={site.url} 
                        secondary="Search Console Property" 
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < importableSites.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Paper>

          <Button 
            variant="contained" 
            fullWidth 
            size="large"
            disabled={selectedUrls.length === 0 || importing}
            onClick={handleImport}
            startIcon={importing ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {importing ? "Importing Websites..." : `Import ${selectedUrls.length} Website${selectedUrls.length !== 1 ? 's' : ''}`}
          </Button>
        </Stack>
      )}
    </Box>
  );
}
