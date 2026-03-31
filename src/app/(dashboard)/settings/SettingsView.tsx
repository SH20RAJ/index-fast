"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  Chip,
  alpha,
} from "@mui/material";
import PageHeader from "@/components/dashboard/PageHeader";

type UserSettings = {
  id: string;
  email: string;
  isPro: boolean | null;
  subscriptionStatus: string | null;
  dodoCustomerId: string | null;
  dodoSubscriptionId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export default function SettingsView() {
  const [data, setData] = useState<UserSettings | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/user/settings")
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to load settings");
        }
        return res.json();
      })
      .then((row: UserSettings) => {
        if (cancelled) {
          return;
        }
        setData(row);
        setEmail(row.email || "");
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) {
          return;
        }
        setFeedback({ type: "error", message: err instanceof Error ? err.message : "Failed to load settings" });
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload.error || "Failed to save settings");
      }

      setData(payload);
      setFeedback({ type: "success", message: "Settings saved." });
    } catch (err: unknown) {
      setFeedback({ type: "error", message: err instanceof Error ? err.message : "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ pt: 1, pb: 8 }}>
      <Stack spacing={3}>
        <PageHeader
          title="Settings"
          description="Manage your account profile and current subscription details."
        />

        {loading ? (
          <Stack alignItems="center" sx={{ py: 10 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <Stack spacing={2.25}>
            {feedback ? <Alert severity={feedback.type}>{feedback.message}</Alert> : null}

            <Card sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
              <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
                <Stack spacing={2}>
                  <Typography variant="h6" fontWeight={800}>
                    Account
                  </Typography>

                  <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    type="email"
                  />

                  <Box>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      disabled={saving}
                      sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 800 }}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "divider",
                boxShadow: "none",
                bgcolor: alpha("#7C3AED", 0.02),
              }}
            >
              <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
                <Stack spacing={1.5}>
                  <Typography variant="h6" fontWeight={800}>
                    Subscription
                  </Typography>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Chip
                      label={data?.isPro ? "Pro plan" : "Free plan"}
                      sx={{ borderRadius: "8px", fontWeight: 800 }}
                      color={data?.isPro ? "success" : "default"}
                    />
                    <Chip
                      label={`Status: ${data?.subscriptionStatus || "inactive"}`}
                      sx={{ borderRadius: "8px", fontWeight: 800 }}
                    />
                  </Stack>

                  <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word" }}>
                    Customer ID: {data?.dodoCustomerId || "Not linked"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word" }}>
                    Subscription ID: {data?.dodoSubscriptionId || "Not linked"}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
