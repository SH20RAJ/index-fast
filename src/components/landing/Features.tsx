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
import QuizIcon from "@mui/icons-material/Quiz";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import VideoGameAssetIcon from "@mui/icons-material/VideoGameAsset";

export default function Features() {
  const theme = useTheme();

  return (
    <Box id="features" sx={{ py: 15 }}>
      <Container maxWidth="lg">
        <Stack spacing={2} mb={10}>
           <Typography variant="h2" sx={{ fontWeight: 900, color: "#1F2937" }}>
             Our 
             <Box component="span" sx={{ color: "primary.main", fontFamily: '"Patrick Hand", cursive', rotate: "-3deg", display: "inline-block", ml: 1 }}>interactive</Box>
             <br /> features
           </Typography>
        </Stack>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", bgcolor: "#F3E8FF", borderRadius: "32px", border: "none", boxShadow: "none" }}>
              <CardContent sx={{ p: 5 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: "12px", bgcolor: alpha(theme.palette.primary.main, 0.1), display: "flex", alignItems: "center", justifyContent: "center", mb: 4 }}>
                   <QuizIcon sx={{ color: "primary.main" }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, fontFamily: '"Patrick Hand", cursive' }}>Fun<br/>Quiz</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 6 }}>
                  Test your understanding with a short but fun quizzes!
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", bgcolor: "primary.main", borderRadius: "32px", border: "none", color: "white", boxShadow: "none" }}>
              <CardContent sx={{ p: 5 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: "12px", bgcolor: alpha("#ffffff", 0.2), display: "flex", alignItems: "center", justifyContent: "center", mb: 4 }}>
                   <ColorLensIcon sx={{ color: "white" }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, fontFamily: '"Patrick Hand", cursive' }}>Creative<br/>Activities</Typography>
                <Typography variant="body2" sx={{ color: alpha("#ffffff", 0.7), mt: 6 }}>
                  Discover enjoyable activities such as coloring, crafting, and science.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%", bgcolor: "#FEF9C3", borderRadius: "32px", border: "none", boxShadow: "none" }}>
              <CardContent sx={{ p: 5 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: "12px", bgcolor: alpha(theme.palette.secondary.main, 0.1), display: "flex", alignItems: "center", justifyContent: "center", mb: 4 }}>
                   <VideoGameAssetIcon sx={{ color: "secondary.main" }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, fontFamily: '"Patrick Hand", cursive' }}>Learn with<br/>Games</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 6 }}>
                  Learn something new while your kids playing games!
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
