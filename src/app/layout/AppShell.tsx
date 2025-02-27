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
import CategoryIcon from '@mui/icons-material/Category';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {Outlet} from "react-router-dom";
import React from "react";

const drawerWidth = 240;

function AppShell()  {

    //todo
    // if nicht eingeloggt -> geh zu login seite
    // maybe mit useEffect

    const navItems = [
        { text: 'Dashboard', link: '/', icon: <DashboardIcon /> },
        { text: 'Bestellungsübersicht', link: '/bestellungen', icon: <LocalMallIcon /> },
        { text: 'Produkte', link: '/produkte', icon: <CategoryIcon /> },
        { text: 'Routenplanung', link: '/routes'},
        { text: 'Fahrzeuge', link: '/fahrzeuge', icon: <LocalShippingIcon /> },
        { text: 'Logout', link: '/logout', icon: <ExitToAppIcon /> }
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
                <Toolbar sx={{display: "flex", justifyContent: "center"}}>
                    <Box
                        component="img"
                        alt="logo"
                        src="logo.svg"
                        maxWidth={drawerWidth - 40}
                    />
                </Toolbar>
                <Divider />
                <List>
                    {navItems.map(({ text, link, icon }) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton href={link}>
                                <ListItemIcon>{icon}</ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider/>
            </Drawer>
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <Outlet/>
            </Box>
        </Box>
    );
}

export default React.memo(AppShell);