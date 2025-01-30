import { Drawer, List, ListItem, ListItemText, Toolbar, Typography } from "@mui/material";

const menuItems: string[] = [
    "Dashboard",
    "Bestellübersicht",
    "Produktübersicht",
    "Artikelverwaltung",
    "Tickets",
    "Lieferoutenplanung",
    "Fahrzeuge",
    "Ladelisten",
];

function Sidebar() {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                [`& .MuiDrawer-paper`]: {
                    width: 240,
                    boxSizing: "border-box",
                },
            }}
        >
            <Toolbar>
                <Typography variant="h6" noWrap>
                    GABBIE
                </Typography>
            </Toolbar>
            <List>
                {menuItems.map((text, index) => (
                    <ListItem component="button" key={index}>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
}

export default Sidebar;