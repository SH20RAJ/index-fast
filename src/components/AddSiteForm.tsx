"use client";

import * as React from "react";
import { 
  Box, 
  TextField, 
  Button, 
  Stack, 
  Alert,
  CircularProgress
} from "@mui/material";
import { addSite } from "@/app/actions/sites";

export default function AddSiteForm({ userId }: { userId: string }) {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await addSite(formData, userId);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // Success will be handled by redirect in Server Action
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          required
          fullWidth
          label="Website URL"
          name="url"
          placeholder="https://example.com"
          helperText="The root domain of the site you want to index."
          variant="outlined"
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Sitemap URL (Optional)"
          name="sitemapUrl"
          placeholder="https://example.com/sitemap.xml"
          helperText="Provide this to automate URL discovery."
          variant="outlined"
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Bing API Key (Optional)"
          name="bingApiKey"
          placeholder="Your Bing Webmaster API Key"
          helperText="Required for Bing Batch submissions."
          variant="outlined"
          disabled={loading}
        />

        <TextField
          fullWidth
          label="IndexNow Key (Optional)"
          name="indexNowKey"
          placeholder="32 character key"
          helperText="We will generate one for you if left empty."
          variant="outlined"
          disabled={loading}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ py: 1.5, fontWeight: "bold" }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Save Website"}
        </Button>
      </Stack>
    </Box>
  );
}
