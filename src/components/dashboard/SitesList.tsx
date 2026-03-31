"use client";

import { Box, Stack } from "@mui/material";
import SiteCard from "@/components/dashboard/SiteCard";
import { Website } from "@/components/dashboard/types";

interface SitesListProps {
  sites: Website[];
  onSync: (id: string) => void;
}

export default function SitesList({ sites, onSync }: SitesListProps) {
  return (
    <Stack spacing={3}>
      {sites.map((site) => (
        <Box key={site.id}>
          <SiteCard site={site} onSync={onSync} />
        </Box>
      ))}
    </Stack>
  );
}