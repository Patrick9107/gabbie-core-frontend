import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import {ReactNode} from "react";

interface props {
    children?: ReactNode
}

function AppShell({ children }: props) {
    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <Box sx={{ width: "250px", bgcolor: "primary.main", color: "white", p: 2 }}>
                <h2>Meine Sidebar</h2>
                <ul>
                    <li><a href="/">Dashboard</a></li>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/bestellungsliste">Bestellungsliste</a></li>
                </ul>
            </Box>

            <Box sx={{ flexGrow: 1, p: 3 }}>
                {children || <Outlet />}
            </Box>
        </Box>
    );
}

export default AppShell;
