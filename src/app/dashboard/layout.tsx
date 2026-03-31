import * as React from "react";
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Container
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PublicIcon from "@mui/icons-material/Public";
import SettingsIcon from "@mui/icons-material/Settings";
import { UserButton } from "@stackframe/stack";

const drawerWidth = 240;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex" }}>
      {/* Top Header */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "background.paper", backgroundImage: "none" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div" sx={{ color: "primary.main", fontWeight: "bold" }}>
            INDEXFAST
          </Typography>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <UserButton showUserInfo={true} />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Side Navigation */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto", mt: 2 }}>
          <List>
            {[
              { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
              { text: "My Sites", icon: <PublicIcon />, path: "/dashboard/sites" },
              { text: "Settings", icon: <SettingsIcon />, path: "/dashboard/settings" },
            ].map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton href={item.path}>
                  <ListItemIcon sx={{ color: "primary.main" }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 10, minHeight: "100vh", bgcolor: "background.default" }}>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
    </Box>
  );
}
