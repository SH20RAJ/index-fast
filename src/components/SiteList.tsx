"use client";

import * as React from "react";
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SyncIcon from "@mui/icons-material/Sync";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { syncSite } from "@/app/actions/sites";

interface Site {
  id: string;
  url: string;
  lastSync: Date | null;
  isActive: boolean | null;
  createdAt: Date | null;
}

export default function SiteList({ sites }: { sites: Site[] }) {
  const [syncingId, setSyncingId] = React.useState<string | null>(null);

  if (sites.length === 0) {
    return null;
  }

  async function handleSync(id: string) {
    setSyncingId(id);
    try {
      const result = await syncSite(id);
      if (result?.error) {
        alert(result.error);
      } else {
        console.log(`Synced ${result?.count} URLs.`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSyncingId(null);
    }
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
      <Table>
        <TableHead sx={{ bgcolor: "rgba(255,255,255,0.05)" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Website</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Last Sync</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sites.map((site) => (
            <TableRow key={site.id} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  {site.url}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Added: {site.createdAt ? new Date(site.createdAt).toLocaleDateString() : "Unknown"}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={site.isActive ? "Monitoring" : "Paused"} 
                  color={site.isActive ? "success" : "default"} 
                  size="small" 
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                {site.lastSync ? new Date(site.lastSync).toLocaleString() : "Never"}
              </TableCell>
              <TableCell align="right">
                <Tooltip title="View Site">
                  <IconButton size="small" href={site.url} target="_blank">
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Trigger Sync">
                  <IconButton 
                    size="small" 
                    color="primary" 
                    onClick={() => handleSync(site.id)}
                    disabled={syncingId === site.id}
                  >
                    {syncingId === site.id ? <CircularProgress size={20} /> : <SyncIcon fontSize="small" />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Site">
                  <IconButton size="small" color="error">
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
