import React, { useState } from 'react';
import { Box, Drawer, CssBaseline, Toolbar, List, Divider, ListItem, ListItemButton, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Dashboard as DashboardIcon, LocalMall as LocalMallIcon, LocalShipping as LocalShippingIcon, History as HistoryIcon, ExitToApp as ExitToAppIcon, InventoryOutlined as InventoryOutlinedIcon, AddLocationAlt } from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import styles from './AppShell.module.css';
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';


function AppShell() {
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('/');

  const handleNavClick = (link: string, action?: () => void) => {
    if (action) {
      action();
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
    { text: 'Behälter', link: '/behaelter', icon: <TakeoutDiningIcon />},
    { text: 'Routenplanung', link: '/routes', icon: <AddLocationAlt /> },
    { text: 'Fahrzeuge', link: '/fahrzeuge', icon: <LocalShippingIcon /> },
    { text: 'Vorherige Routen', link: '/history', icon: <HistoryIcon /> },
    { text: 'Logout', link: '/logout', icon: <ExitToAppIcon />, action: handleLogoutClick }
  ];

  return (
      <Box className={styles.appShellContainer}>
        <CssBaseline />
        <Drawer className={styles.drawer} variant="permanent" anchor="left">
          <Toolbar className={styles.toolbar}>
            <Box component="img" alt="logo" src="logo.svg" className={styles.logo} />
          </Toolbar>
          <Divider />
          <List>
            {navItems.map(({ text, link, icon, action }) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton
                      onClick={() => handleNavClick(link, action)}
                      className={`${styles.navItem} ${selectedItem === link ? styles.selected : ''}`}
                      // todo ^ funktioniert nicht, navitem sollte leuchten wenn man auf der seite ist
                  >
                    <ListItemIcon>{icon}</ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
            ))}
          </List>
          <Divider />
        </Drawer>
        <Box component="main" className={styles.mainContent}>
          <Outlet />
        </Box>

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
