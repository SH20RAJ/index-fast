"use client";
import { useActionState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PublicIcon from "@mui/icons-material/Public";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import {
  addWebsiteAction,
  deleteWebsiteAction,
  runWebsiteSyncAction,
} from "@/app/(dashboard)/actions";
import { defaultActionState, type ActionState } from "@/app/(dashboard)/action-state";

interface WebsiteRecord {
  id: string;
  url: string;
  sitemapUrl: string | null;
  indexNowKey: string | null;
  bingApiKey: string | null;
  gscConnected: boolean | null;
  lastSyncAt: Date | null;
}

interface SitesViewProps {
  initialSites: WebsiteRecord[];
  planName: string;
  websiteLimit: number;
}

export default function SitesView({ initialSites, planName, websiteLimit }: SitesViewProps) {
  const [createState, createAction, createPending] = useActionState<ActionState, FormData>(
    addWebsiteAction,
    defaultActionState
  );
  const [syncState, syncAction, syncPending] = useActionState<ActionState, FormData>(
    runWebsiteSyncAction,
    defaultActionState
  );
  const [deleteState, deleteAction, deletePending] = useActionState<ActionState, FormData>(
    deleteWebsiteAction,
    defaultActionState
  );

  const slotsLeft = Math.max(0, websiteLimit - initialSites.length);

  return (
    <Box sx={{ pt: 1, pb: 8 }}>
      <Stack spacing={3}>
        <PageHeader
          title="Websites"
          description="Manage tracked websites, trigger indexing syncs, and stay within plan limits."
          action={
            <Chip
              label={`${planName} plan · ${initialSites.length}/${websiteLimit} sites`}
              color="primary"
              sx={{ borderRadius: "10px", fontWeight: 800 }}
            />
          }
        />

        {createState.status !== "idle" ? <Alert severity={createState.status}>{createState.message}</Alert> : null}
        {syncState.status !== "idle" ? <Alert severity={syncState.status}>{syncState.message}</Alert> : null}
        {deleteState.status !== "idle" ? <Alert severity={deleteState.status}>{deleteState.message}</Alert> : null}

        <Card sx={{ borderRadius: "18px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
          <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
            <Stack component="form" action={createAction} spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }}>
                <Typography variant="h6" fontWeight={900}>
                  Add Website
                </Typography>
                <Typography variant="body2" color={slotsLeft === 0 ? "error.main" : "text.secondary"}>
                  {slotsLeft} slot(s) left on {planName}
                </Typography>
              </Stack>

              <TextField label="Website URL" name="url" placeholder="https://example.com" fullWidth required />
              <TextField label="Sitemap URL" name="sitemapUrl" placeholder="https://example.com/sitemap.xml" fullWidth />

              <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                <TextField label="IndexNow key (optional)" name="indexNowKey" fullWidth />
                <TextField label="Bing API key (optional)" name="bingApiKey" fullWidth />
              </Stack>

              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled={createPending}
                  sx={{ borderRadius: "11px", fontWeight: 800, textTransform: "none" }}
                >
                  {createPending ? "Adding..." : "Add Website"}
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          {initialSites.length === 0 ? (
            <Card sx={{ borderRadius: "18px", border: "1px dashed", borderColor: "divider", boxShadow: "none" }}>
              <CardContent sx={{ py: 7, textAlign: "center" }}>
                <PublicIcon sx={{ fontSize: 44, opacity: 0.2, mb: 1 }} />
                <Typography variant="h6" fontWeight={900}>
                  No websites yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add your first website to start syncing sitemap URLs and tracking submissions.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            initialSites.map((site) => (
              <Card
                key={site.id}
                sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}
              >
                <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                  <Stack spacing={1.5}>
                    <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1.5}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={900} sx={{ wordBreak: "break-all" }}>
                          {site.url}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-all" }}>
                          Sitemap: {site.sitemapUrl || "Not configured"}
                        </Typography>
                      </Box>

                      <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" alignItems="flex-start">
                        <Chip label={site.indexNowKey ? "IndexNow ready" : "No IndexNow key"} size="small" sx={{ borderRadius: "8px", fontWeight: 700 }} />
                        <Chip label={site.bingApiKey ? "Bing ready" : "No Bing API key"} size="small" sx={{ borderRadius: "8px", fontWeight: 700 }} />
                        <Chip label={site.gscConnected ? "GSC connected" : "GSC not connected"} size="small" sx={{ borderRadius: "8px", fontWeight: 700 }} />
                      </Stack>
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                      Last sync: {site.lastSyncAt ? new Date(site.lastSyncAt).toLocaleString() : "Never"}
                    </Typography>

                    <Divider sx={{ borderColor: alpha("#111827", 0.08) }} />

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                      <Box component="form" action={syncAction} sx={{ width: { xs: "100%", sm: "auto" } }}>
                        <input type="hidden" name="websiteId" value={site.id} />
                        <Button type="submit" variant="contained" startIcon={<RefreshIcon />} disabled={syncPending} fullWidth sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 800 }}>
                          Sync Sitemap
                        </Button>
                      </Box>

                      <Link href={`/sites/${site.id}/audit`} style={{ textDecoration: "none", width: "100%" }}>
                        <Button variant="outlined" startIcon={<AssessmentOutlinedIcon />} fullWidth sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 800 }}>
                          View Audit
                        </Button>
                      </Link>

                      <Box component="form" action={deleteAction} sx={{ width: { xs: "100%", sm: "auto" } }}>
                        <input type="hidden" name="websiteId" value={site.id} />
                        <Button type="submit" color="error" variant="outlined" startIcon={<DeleteOutlineIcon />} disabled={deletePending} fullWidth sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 800 }}>
                          Remove
                        </Button>
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
