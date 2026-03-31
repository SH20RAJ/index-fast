"use client";
import * as React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  alpha,
  useTheme,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SpeedIcon from "@mui/icons-material/Speed";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

export default function Features() {
  const theme = useTheme();

  return (
    <Box id="features" sx={{ py: 15 }}>
      <Container maxWidth="lg">
        <Stack spacing={2} mb={10} textAlign="center">
           <Typography variant="h2" sx={{ fontWeight: 900, color: "#1F2937" }}>
             Powerful 
             <Box component="span" sx={{ color: "primary.main", fontFamily: '"Patrick Hand", cursive', rotate: "-3deg", display: "inline-block", ml: 1 }}>indexing</Box>
             <br /> for every site
           </Typography>
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", bgcolor: "#F3E8FF", borderRadius: "32px", border: "none", boxShadow: "none" }}>
              <CardContent sx={{ p: 5 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: "12px", bgcolor: alpha(theme.palette.primary.main, 0.1), display: "flex", alignItems: "center", justifyContent: "center", mb: 4 }}>
                   <SpeedIcon sx={{ color: "primary.main" }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, fontFamily: '"Patrick Hand", cursive' }}>Instant<br/>Submission</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 6 }}>
                  Direct search engine pinging to ensure your content is discovered in seconds.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", bgcolor: "primary.main", borderRadius: "32px", border: "none", color: "white", boxShadow: "none" }}>
              <CardContent sx={{ p: 5 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: "12px", bgcolor: alpha("#ffffff", 0.2), display: "flex", alignItems: "center", justifyContent: "center", mb: 4 }}>
                   <AutoFixHighIcon sx={{ color: "white" }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, fontFamily: '"Patrick Hand", cursive' }}>Auto<br/>Sync</Typography>
                <Typography variant="body2" sx={{ color: alpha("#ffffff", 0.7), mt: 6 }}>
                  Connect your sitemaps and let us handle the tedious work of content updates.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", bgcolor: "#FEF9C3", borderRadius: "32px", border: "none", boxShadow: "none" }}>
              <CardContent sx={{ p: 5 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: "12px", bgcolor: alpha(theme.palette.secondary.main, 0.1), display: "flex", alignItems: "center", justifyContent: "center", mb: 4 }}>
                   <SearchIcon sx={{ color: "secondary.main" }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, fontFamily: '"Patrick Hand", cursive' }}>Smart<br/>Retries</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 6 }}>
                  Advanced retry logic that guarantees your URLs are processed despite any failure.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
