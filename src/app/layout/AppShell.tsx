import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import { Outlet, useNavigate } from 'react-router-dom';
import { AddLocationAlt } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const drawerWidth = 240;

function AppShell() {
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('/'); // Track active item

  const handleNavClick = (link: string, action?: () => void) => {
    if (action) {
      action(); // Handle logout separately
    } else {
      setSelectedItem(link);
      navigate(link);
    }
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    navigate('/logout');
  };

  const handleLogoutCancel = () => {
    setLogoutDialogOpen(false);
  };

  const navItems = [
    { text: 'Dashboard', link: '/', icon: <DashboardIcon /> },
    { text: 'Bestellungsübersicht', link: '/bestellungen', icon: <LocalMallIcon /> },
    { text: 'Produkte', link: '/produkte', icon: <InventoryOutlinedIcon /> },
    { text: 'Routenplanung', link: '/routes', icon: <AddLocationAlt /> },
    { text: 'Fahrzeuge', link: '/fahrzeuge', icon: <LocalShippingIcon /> },
    { text: 'Logout', link: '/logout', icon: <ExitToAppIcon />, action: handleLogoutClick }
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box
            component="img"
            alt="logo"
            src="logo.svg"
            maxWidth={drawerWidth - 40}
          />
        </Toolbar>
        <Divider />
        <List>
          {navItems.map(({ text, link, icon, action }) => (
            <ListItem key={text} disablePadding>
              <ListItemButton
                onClick={() => handleNavClick(link, action)}
                sx={{
                  backgroundColor: selectedItem === link ? '#ddd' : 'inherit',
                  '&:hover': { backgroundColor: '#ccc' },
                }}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onClose={handleLogoutCancel}>
        <DialogTitle>Abmelden</DialogTitle>
        <DialogContent>Möchtest du dich wirklich abmelden?</DialogContent>
        <DialogActions>
          <Button onClick={handleLogoutCancel} color="inherit">
            Abbrechen
          </Button>
          <Button onClick={handleLogoutConfirm} color="error" variant="contained">
            Abmelden
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default React.memo(AppShell);