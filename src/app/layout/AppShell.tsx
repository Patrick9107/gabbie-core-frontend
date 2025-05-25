import React, { useState, useMemo, useCallback } from 'react';
import {
  Box,
  Drawer,
  CssBaseline,
  Toolbar,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  Typography,
  Switch, Snackbar, Alert
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LocalMall as LocalMallIcon,
  LocalShipping as LocalShippingIcon,
  History as HistoryIcon,
  ExitToApp as ExitToAppIcon,
  InventoryOutlined as InventoryOutlinedIcon,
  AddLocationAlt as AddLocationAltIcon,
  TakeoutDining as TakeoutDiningIcon,
  Mail,
} from '@mui/icons-material';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import {setSmsFlag} from "../../infra/api/smsService.ts";

const drawerWidth = 250;

interface NavItem {
  text?: string;
  link?: string;
  icon?: React.ReactElement;
  action?: () => void;
  divider?: boolean;
  isSmsToggle?: boolean;
}

function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info'; // As per your type
  } | null>(null);

  const handleNavClick = useCallback((link?: string, action?: () => void) => {
    if (action) {
      action();
    } else if (link) {
      navigate(link);
    }
  }, [navigate]);

  const handleLogoutClick = useCallback(() => {
    setLogoutDialogOpen(true);
  }, []);

  const handleLogoutConfirm = useCallback(() => {
    setLogoutDialogOpen(false);
    navigate('/logout');
  }, [navigate]);

  const handleLogoutCancel = useCallback(() => {
    setLogoutDialogOpen(false);
  }, []);

  const handleSmsToggle = useCallback(async () => {
    const originalSmsState = smsEnabled;
    const newSmsState = !originalSmsState;

    setSmsEnabled(newSmsState);

    try {
      await setSmsFlag(newSmsState);
      console.log(`SMS status successfully updated to: ${newSmsState}`);
    } catch (error) {
      setSmsEnabled(originalSmsState);
      console.error('Failed to update SMS status via API:', error);

      const errorMessage = error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten.';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  }, [smsEnabled, setSmsEnabled]);

  const handleCloseSnackbar = () => {
    setSnackbar(null);
  };

  const navItems: NavItem[] = useMemo(() => [
    { text: 'Dashboard', link: '/', icon: <DashboardIcon /> },
    { text: 'Bestellungen', link: '/bestellungen', icon: <LocalMallIcon /> },
    { text: 'Produkte', link: '/produkte', icon: <InventoryOutlinedIcon /> },
    { text: 'Behälter', link: '/behaelter', icon: <TakeoutDiningIcon /> },
    { text: 'Routenplanung', link: '/routes', icon: <AddLocationAltIcon /> },
    { text: 'Fahrzeuge', link: '/fahrzeuge', icon: <LocalShippingIcon /> },
    { text: 'Routen Historie', link: '/history', icon: <HistoryIcon /> },
    { divider: true },
    { text: 'SMS', icon: <Mail />, isSmsToggle: true },
    { divider: true },
    { text: 'Abmelden', link: '/logout', icon: <ExitToAppIcon />, action: handleLogoutClick }
  ], [handleLogoutClick]);

  return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                borderRight: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
              },
            }}
        >
          <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
            <Box component="img" alt="Firmenlogo" src="/logo.svg" sx={{ maxHeight: 40, maxWidth: '80%' }} />
          </Toolbar>
          <Divider />
          <List sx={{ p: 1 }}>
            {navItems.map((item, index) => {
              if (item.divider) {
                return <Divider key={`divider-${index}`} sx={{ my: 1 }} />;
              }

              // Handle SMS toggle item
              if (item.isSmsToggle) {
                return (
                    <ListItem key={item.text || `sms-toggle-${index}`} disablePadding sx={{ display: 'block', mb: 0.5 }}>
                      <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            minHeight: 48,
                            px: 2.5,
                            borderRadius: '8px', // Consistent styling
                            color: theme.palette.text.secondary, // Consistent styling
                          }}
                      >
                        {item.icon && (
                            <ListItemIcon
                                sx={{
                                  minWidth: 0,
                                  mr: 3,
                                  justifyContent: 'center',
                                  color: 'inherit',
                                }}
                            >
                              {item.icon}
                            </ListItemIcon>
                        )}
                        {item.text && <ListItemText primary={item.text} sx={{ opacity: 1, flexGrow: 1 }} />}
                        <Switch
                            checked={smsEnabled}
                            onChange={handleSmsToggle}
                            onClick={(e) => e.stopPropagation()} // Prevent click bubbling if any
                            inputProps={{ 'aria-label': `Toggle ${item.text}` }}
                        />
                      </Box>
                    </ListItem>
                );
              }

              // Regular navigation items
              return (
                  <ListItem key={item.text || `item-${index}`} disablePadding sx={{ display: 'block', mb: 0.5 }}>
                    <ListItemButton
                        onClick={() => handleNavClick(item.link, item.action)}
                        selected={!item.action && !!item.link && location.pathname === item.link}
                        sx={{
                          minHeight: 48,
                          justifyContent: 'initial',
                          px: 2.5,
                          borderRadius: '8px',
                          color: theme.palette.text.secondary,
                          '&:hover': {
                            backgroundColor: theme.palette.action.hover,
                          },
                          '&.Mui-selected': {
                            backgroundColor: alpha('#3d9970', 0.08),
                            color: '#3d9970',
                            fontWeight: 'bold',
                            '& .MuiListItemIcon-root': {
                              color: '#3d9970',
                            },
                          },
                          '&.Mui-selected:hover': {
                            backgroundColor: alpha('#3d9970', 0.12),
                          }
                        }}
                    >
                      {item.icon && (
                          <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: 3,
                                justifyContent: 'center',
                                color: 'inherit', // Will inherit selected color
                              }}
                          >
                            {item.icon}
                          </ListItemIcon>
                      )}
                      {item.text && <ListItemText primary={item.text} sx={{ opacity: 1 }} />}
                    </ListItemButton>
                  </ListItem>
              );
            })}
          </List>
        </Drawer>
        <Box
            component="main"
            sx={{
              flexGrow: 1,
              bgcolor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
              p: 3,
              height: '100vh',
              overflow: 'auto'
            }}
        >
          <Outlet />
        </Box>

        <Dialog open={logoutDialogOpen} onClose={handleLogoutCancel} aria-labelledby="logout-dialog-title">
          <DialogTitle id="logout-dialog-title">Abmeldung bestätigen</DialogTitle>
          <DialogContent>
            <Typography>Möchten Sie sich wirklich abmelden?</Typography>
          </DialogContent>
          <DialogActions sx={{p: '16px 24px'}}>
            <Button onClick={handleLogoutCancel} color="inherit">
              Abbrechen
            </Button>
            <Button onClick={handleLogoutConfirm} color="error" variant="contained" autoFocus>
              Abmelden
            </Button>
          </DialogActions>
        </Dialog>
        {snackbar && (
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
                {snackbar.message}
              </Alert>
            </Snackbar>
        )}
      </Box>
  );
}

export default React.memo(AppShell);