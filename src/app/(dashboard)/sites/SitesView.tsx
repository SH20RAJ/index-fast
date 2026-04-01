"use client";
import { useActionState, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  Divider,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
  Collapse,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PublicIcon from "@mui/icons-material/Public";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Link from "next/link";
import PageHeader from "@/components/dashboard/PageHeader";
import {
  addWebsiteAction,
  deleteWebsiteAction,
  runWebsiteSyncAction,
  refreshGscMetadataAction,
  updateWebsiteIndexingKeysAction,
} from "@/app/(dashboard)/actions";
import { defaultActionState, type ActionState } from "@/app/(dashboard)/action-state";

interface GscProperty {
  propertyUrl: string;
  permissionLevel: string;
  normalizedUrl: string | null;
  supported: boolean;
  alreadyImported: boolean;
}

interface GscSitesResponse {
  connected: boolean;
  sites: GscProperty[];
  error?: string;
}

interface WebsiteRecord {
  id: string;
  url: string;
  sitemapUrl: string | null;
  indexNowKey: string | null;
  bingApiKey: string | null;
  siteHealth: unknown;
  gscConnected: boolean | null;
  lastSyncAt: Date | null;
}

interface SitesViewProps {
  initialSites: WebsiteRecord[];
  planName: string;
  websiteLimit: number;
}

export default function SitesView({ initialSites, planName, websiteLimit }: SitesViewProps) {
  const [gscLoading, setGscLoading] = useState(false);
  const [gscImporting, setGscImporting] = useState(false);
  const [gscConnected, setGscConnected] = useState(false);
  const [gscSites, setGscSites] = useState<GscProperty[]>([]);
  const [gscSelection, setGscSelection] = useState<Set<string>>(new Set());
  const [gscError, setGscError] = useState<string | null>(null);
  const [gscStatusMessage, setGscStatusMessage] = useState<string | null>(null);
  const [processLogs, setProcessLogs] = useState<string[]>([]);
  const [editingSiteId, setEditingSiteId] = useState<string | null>(null);
  const [addWebsiteExpanded, setAddWebsiteExpanded] = useState(initialSites.length === 0);
  const [siteSearchQuery, setSiteSearchQuery] = useState("");

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
  const [refreshState, refreshAction, refreshPending] = useActionState<ActionState, FormData>(
    refreshGscMetadataAction,
    defaultActionState
  );
  const [updateKeysState, updateKeysAction, updateKeysPending] = useActionState<ActionState, FormData>(
    updateWebsiteIndexingKeysAction,
    defaultActionState
  );

  const slotsLeft = Math.max(0, websiteLimit - initialSites.length);

  const selectableSites = useMemo(
    () => gscSites.filter((site) => site.supported && !site.alreadyImported),
    [gscSites]
  );

  const filteredSites = useMemo(() => {
    const query = siteSearchQuery.trim().toLowerCase();
    if (!query) {
      return initialSites;
    }

    return initialSites.filter((site) =>
      [site.url, site.sitemapUrl ?? "", site.lastSyncAt ? new Date(site.lastSyncAt).toLocaleString() : ""]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [initialSites, siteSearchQuery]);

  const gscConnectedCount = useMemo(
    () => initialSites.filter((site) => Boolean(site.gscConnected)).length,
    [initialSites]
  );

  const credentialsCompleteCount = useMemo(
    () =>
      initialSites.filter((site) => Boolean(site.indexNowKey) && Boolean(site.bingApiKey) && Boolean(getIndexNowKeyLocationUrl(site)))
        .length,
    [initialSites]
  );

  function getIndexNowKeyLocationUrl(site: WebsiteRecord) {
    if (!site.siteHealth || typeof site.siteHealth !== "object") {
      return "";
    }

    const root = site.siteHealth as Record<string, unknown>;
    const indexing = root.indexing as Record<string, unknown> | undefined;
    const indexNow = indexing?.indexNow as Record<string, unknown> | undefined;
    const keyLocationUrl = indexNow?.keyLocationUrl;
    return typeof keyLocationUrl === "string" ? keyLocationUrl : "";
  }

  function logStep(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    setProcessLogs((prev) => [`[${timestamp}] ${message}`, ...prev].slice(0, 40));
  }

  async function loadGscSites() {
    setGscLoading(true);
    setGscError(null);
    logStep("Fetching GSC properties...");
    try {
      const response = await fetch("/api/gsc/sites", { cache: "no-store" });
      const data = (await response.json()) as GscSitesResponse;

      if (!response.ok) {
        throw new Error(data.error || "Failed to load GSC properties.");
      }

      setGscConnected(Boolean(data.connected));
      setGscSites(data.sites || []);
      setGscSelection(new Set());
      logStep(`Loaded ${data.sites?.length ?? 0} properties from Google Search Console.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load GSC properties.";
      setGscError(message);
      setGscConnected(false);
      setGscSites([]);
      logStep(`Failed to fetch properties: ${message}`);
    } finally {
      setGscLoading(false);
    }
  }

  async function importSelectedGscSites() {
    if (gscSelection.size === 0) {
      setGscError("Select at least one property to import.");
      return;
    }

    setGscImporting(true);
    setGscError(null);
    setGscStatusMessage(null);
    logStep(`Import started for ${gscSelection.size} selected propert${gscSelection.size === 1 ? "y" : "ies"}.`);

    try {
      const response = await fetch("/api/gsc/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedSiteUrls: Array.from(gscSelection) }),
      });

      const payload = (await response.json()) as {
        message?: string;
        error?: string;
        importedCount?: number;
        skippedCount?: number;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Import failed.");
      }

      const message = payload.message || "Import complete.";
      setGscStatusMessage(message);
      logStep(
        `Import completed: ${payload.importedCount ?? 0} added, ${payload.skippedCount ?? 0} skipped.`
      );

      await loadGscSites();
      window.location.reload();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Import failed.";
      setGscError(message);
      logStep(`Import failed: ${message}`);
    } finally {
      setGscImporting(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const gscStatus = params.get("gsc");
    const gscMessage = params.get("gsc_message");

    if (gscStatus === "connected") {
      setGscStatusMessage("Google connected. Select the properties you want to import.");
      logStep("Google OAuth completed successfully.");
      void loadGscSites();
    }

    if (gscStatus === "error") {
      const message = gscMessage || "Google OAuth failed. Please try again.";
      setGscError(message);
      logStep(`Google OAuth error: ${message}`);
    }

    if (gscStatus || gscMessage) {
      params.delete("gsc");
      params.delete("gsc_message");
      const nextQuery = params.toString();
      const nextUrl = `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`;
      window.history.replaceState({}, "", nextUrl);
    }
  }, []);

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
        {refreshState.status !== "idle" ? <Alert severity={refreshState.status}>{refreshState.message}</Alert> : null}
        {updateKeysState.status !== "idle" ? <Alert severity={updateKeysState.status}>{updateKeysState.message}</Alert> : null}
        {gscError ? <Alert severity="error">{gscError}</Alert> : null}
        {gscStatusMessage ? <Alert severity="success">{gscStatusMessage}</Alert> : null}

        <Card sx={{ borderRadius: "18px", border: "1px solid", borderColor: "divider", boxShadow: "none", overflow: "hidden" }}>
          <Accordion
            expanded={addWebsiteExpanded}
            onChange={(_, expanded) => setAddWebsiteExpanded(expanded)}
            disableGutters
            elevation={0}
            sx={{ "&:before": { display: "none" }, bgcolor: "transparent" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreRoundedIcon />}
              sx={{ px: { xs: 2.25, md: 3 }, py: 1.2 }}
            >
              <Stack direction={{ xs: "column", sm: "row" }} alignItems={{ xs: "flex-start", sm: "center" }} justifyContent="space-between" sx={{ width: "100%" }} spacing={1}>
                <Box>
                  <Typography variant="h6" fontWeight={900}>
                    Add Website
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add a domain, sitemap, and optional indexing credentials.
                  </Typography>
                </Box>
                <Chip
                  label={`${slotsLeft} slot(s) left on ${planName}`}
                  color={slotsLeft === 0 ? "error" : "default"}
                  sx={{ borderRadius: "10px", fontWeight: 700 }}
                />
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ px: { xs: 2.25, md: 3 }, pb: { xs: 2.25, md: 3 }, pt: 0 }}>
              <Stack component="form" action={createAction} spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25} alignItems={{ xs: "flex-start", sm: "center" }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => {
                      logStep("Opening Google OAuth consent screen...");
                      window.location.href = "/api/gsc/oauth/start?returnTo=/sites";
                    }}
                    sx={{ borderRadius: "10px", fontWeight: 800, textTransform: "none" }}
                  >
                    Connect Google Search Console
                  </Button>
                  {gscConnected ? (
                    <Button
                      variant="text"
                      onClick={() => {
                        void loadGscSites();
                      }}
                      disabled={gscLoading}
                      sx={{ borderRadius: "10px", fontWeight: 800, textTransform: "none" }}
                    >
                      {gscLoading ? "Loading…" : "Refresh GSC List"}
                    </Button>
                  ) : null}
                </Stack>

                <TextField
                  label="Website URL"
                  name="url"
                  type="url"
                  autoComplete="url"
                  placeholder="https://example.com"
                  fullWidth
                  required
                />
                <TextField
                  label="Sitemap URL"
                  name="sitemapUrl"
                  type="url"
                  autoComplete="off"
                  placeholder="https://example.com/sitemap.xml"
                  fullWidth
                />

                <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                  <TextField label="IndexNow key (optional)" name="indexNowKey" fullWidth />
                  <TextField label="Bing API key (optional)" name="bingApiKey" fullWidth />
                </Stack>

                <TextField
                  label="IndexNow key text URL (optional)"
                  name="indexNowKeyLocationUrl"
                  type="url"
                  autoComplete="off"
                  placeholder="https://example.com/your-key.txt"
                  fullWidth
                  helperText="Used for IndexNow keyLocation validation during auto submission."
                />

                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<AddIcon />}
                    disabled={createPending}
                    sx={{ borderRadius: "11px", fontWeight: 800, textTransform: "none" }}
                  >
                    {createPending ? "Adding…" : "Add Website"}
                  </Button>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Card>

        {(gscConnected || gscLoading || gscSites.length > 0 || processLogs.length > 0) && (
          <Card sx={{ borderRadius: "18px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
            <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
              <Stack spacing={2}>
                <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1.25}>
                  <Box>
                    <Typography variant="h6" fontWeight={900}>Google Search Console Properties</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Select properties to import. URL-prefix and domain properties are both supported.
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      onClick={() => void loadGscSites()}
                      disabled={gscLoading || gscImporting}
                      startIcon={gscLoading ? <CircularProgress size={14} /> : <RefreshIcon />}
                      sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 800 }}
                    >
                      Reload List
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() => void importSelectedGscSites()}
                      disabled={gscImporting || gscSelection.size === 0}
                      startIcon={<CheckCircleOutlineIcon />}
                      sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 800 }}
                    >
                      {gscImporting ? "Importing…" : `Add Selected (${gscSelection.size})`}
                    </Button>
                  </Stack>
                </Stack>

                {gscLoading ? (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CircularProgress size={18} />
                    <Typography variant="body2" color="text.secondary">Fetching properties from GSC…</Typography>
                  </Stack>
                ) : null}

                {!gscLoading && gscSites.length > 0 ? (
                  <Stack spacing={1}>
                    {gscSites.map((site) => {
                      const disabled = !site.supported || site.alreadyImported;
                      const checked = gscSelection.has(site.propertyUrl);
                      const helper = site.alreadyImported
                        ? "Already imported"
                        : site.supported
                        ? site.permissionLevel
                        : "Property format unsupported";

                      return (
                        <Box
                          key={site.propertyUrl}
                          sx={{
                            border: "1px solid",
                            borderColor: "divider",
                            borderRadius: "10px",
                            px: 1.5,
                            py: 1,
                          }}
                        >
                          <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={1}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={checked}
                                  disabled={disabled}
                                  onChange={(event) => {
                                    setGscSelection((prev) => {
                                      const next = new Set(prev);
                                      if (event.target.checked) {
                                        next.add(site.propertyUrl);
                                      } else {
                                        next.delete(site.propertyUrl);
                                      }
                                      return next;
                                    });
                                  }}
                                />
                              }
                              label={
                                <Stack spacing={0.25}>
                                  <Typography variant="body2" fontWeight={700} sx={{ wordBreak: "break-all" }}>
                                    {site.propertyUrl}
                                  </Typography>
                                  {site.normalizedUrl ? (
                                    <Typography variant="caption" color="text.secondary" sx={{ wordBreak: "break-all" }}>
                                      Will add as: {site.normalizedUrl}
                                    </Typography>
                                  ) : null}
                                </Stack>
                              }
                            />
                            <Chip
                              size="small"
                              label={helper}
                              color={site.alreadyImported ? "default" : site.supported ? "primary" : "warning"}
                              sx={{ borderRadius: "8px", fontWeight: 700, alignSelf: "flex-start" }}
                            />
                          </Stack>
                        </Box>
                      );
                    })}
                    {selectableSites.length === 0 ? (
                      <Alert severity="info">No importable new properties were found.</Alert>
                    ) : null}
                  </Stack>
                ) : null}

                {processLogs.length > 0 ? (
                  <Box sx={{ border: "1px dashed", borderColor: "divider", borderRadius: "10px", p: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>
                      Import Process Logs
                    </Typography>
                    <Stack spacing={0.5}>
                      {processLogs.map((entry) => (
                        <Typography key={entry} variant="caption" color="text.secondary" sx={{ fontFamily: "monospace" }}>
                          {entry}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                ) : null}
              </Stack>
            </CardContent>
          </Card>
        )}

        <Card sx={{ borderRadius: "16px", border: "1px solid", borderColor: "divider", boxShadow: "none" }}>
          <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }}>
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip label={`Total: ${initialSites.length}`} size="small" sx={{ borderRadius: "8px", fontWeight: 700 }} />
                <Chip label={`GSC Connected: ${gscConnectedCount}`} size="small" color="primary" sx={{ borderRadius: "8px", fontWeight: 700 }} />
                <Chip
                  label={`Keys Complete: ${credentialsCompleteCount}`}
                  size="small"
                  color={credentialsCompleteCount > 0 ? "success" : "default"}
                  sx={{ borderRadius: "8px", fontWeight: 700 }}
                />
              </Stack>

              <TextField
                value={siteSearchQuery}
                onChange={(event) => setSiteSearchQuery(event.target.value)}
                size="small"
                placeholder="Search websites..."
                InputProps={{ startAdornment: <SearchRoundedIcon sx={{ fontSize: 18, mr: 1, color: "text.secondary" }} /> }}
                sx={{ width: { xs: "100%", md: 280 } }}
              />
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
          ) : filteredSites.length === 0 ? (
            <Card sx={{ borderRadius: "18px", border: "1px dashed", borderColor: "divider", boxShadow: "none" }}>
              <CardContent sx={{ py: 5, textAlign: "center" }}>
                <Typography variant="h6" fontWeight={900}>
                  No matching websites
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try a different search term.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            filteredSites.map((site) => (
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
                        <Chip
                          label={getIndexNowKeyLocationUrl(site) ? "IndexNow key URL set" : "No IndexNow key URL"}
                          size="small"
                          sx={{ borderRadius: "8px", fontWeight: 700 }}
                        />
                        <Chip label={site.gscConnected ? "GSC connected" : "GSC not connected"} size="small" sx={{ borderRadius: "8px", fontWeight: 700 }} />
                      </Stack>
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                      Last sync: {site.lastSyncAt ? new Date(site.lastSyncAt).toLocaleString() : "Never"}
                    </Typography>

                    <Divider sx={{ borderColor: "divider" }} />

                    <Stack direction="row" spacing={1.25} useFlexGap flexWrap="wrap">
                      <Box component="form" action={syncAction} sx={{ width: { xs: "100%", sm: "auto" } }}>
                        <input type="hidden" name="websiteId" value={site.id} />
                        <Button type="submit" variant="contained" startIcon={<RefreshIcon />} disabled={syncPending} fullWidth sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 800 }}>
                          Sync Sitemap
                        </Button>
                      </Box>

                      {site.gscConnected && (
                        <Box component="form" action={refreshAction} sx={{ width: { xs: "100%", sm: "auto" } }}>
                          <input type="hidden" name="websiteId" value={site.id} />
                          <Button type="submit" variant="outlined" startIcon={<RefreshIcon />} disabled={refreshPending} fullWidth sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 800 }}>
                            Refresh GSC
                          </Button>
                        </Box>
                      )}

                      <Button
                        component={Link}
                        href={`/sites/${site.id}/audit`}
                        variant="outlined"
                        startIcon={<AssessmentOutlinedIcon />}
                        sx={{ width: { xs: "100%", sm: "auto" }, borderRadius: "10px", textTransform: "none", fontWeight: 800 }}
                      >
                        View Audit
                      </Button>

                      <Button
                        variant="outlined"
                        startIcon={<EditOutlinedIcon />}
                        onClick={() => setEditingSiteId((prev) => (prev === site.id ? null : site.id))}
                        sx={{ width: { xs: "100%", sm: "auto" }, borderRadius: "10px", textTransform: "none", fontWeight: 800 }}
                      >
                        {editingSiteId === site.id ? "Close Edit" : "Edit Indexing"}
                      </Button>

                      <Box component="form" action={deleteAction} sx={{ width: { xs: "100%", sm: "auto" } }}>
                        <input type="hidden" name="websiteId" value={site.id} />
                        <Button type="submit" color="error" variant="outlined" startIcon={<DeleteOutlineIcon />} disabled={deletePending} fullWidth sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 800 }}>
                          Remove
                        </Button>
                      </Box>
                    </Stack>

                    <Collapse in={editingSiteId === site.id} unmountOnExit>
                      <Box
                        component="form"
                        action={updateKeysAction}
                        sx={{
                          mt: 1,
                          p: 1.75,
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: "12px",
                          bgcolor: "background.default",
                        }}
                      >
                        <input type="hidden" name="websiteId" value={site.id} />
                        <Stack spacing={1.5}>
                          <Typography variant="subtitle2" fontWeight={800}>
                            Indexing Credentials
                          </Typography>
                          <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                            <TextField
                              name="bingApiKey"
                              label="Bing API key"
                              defaultValue={site.bingApiKey ?? ""}
                              placeholder="Used with SubmitUrlbatch endpoint"
                              fullWidth
                            />
                            <TextField
                              name="indexNowKey"
                              label="IndexNow key"
                              defaultValue={site.indexNowKey ?? ""}
                              placeholder="Key in your key .txt file"
                              fullWidth
                            />
                          </Stack>
                          <TextField
                            name="indexNowKeyLocationUrl"
                            label="IndexNow key text URL"
                            type="url"
                            defaultValue={getIndexNowKeyLocationUrl(site)}
                            placeholder="https://example.com/your-key.txt"
                            helperText="Example: https://yourdomain.com/your-indexnow-key.txt"
                            fullWidth
                          />
                          <Box>
                            <Button
                              type="submit"
                              variant="contained"
                              disabled={updateKeysPending}
                              sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 800 }}
                            >
                              {updateKeysPending ? "Saving..." : "Save Credentials"}
                            </Button>
                          </Box>
                        </Stack>
                      </Box>
                    </Collapse>
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
