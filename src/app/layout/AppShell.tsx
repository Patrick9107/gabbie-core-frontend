import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import {ReactNode} from "react";
import styles from "./AppShell.module.css";

interface props {
    children?: ReactNode
}

function AppShell({ children }: props) {
    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <Box sx={{ width: "250px", bgcolor: "#235817", color: "white", p: 2 }}>
                <h2>Meine Sidebar</h2>
                <ul className={styles.ul}>
                    <li><a className={styles.a} href="/">Dashboard</a></li>
                    <li><a className={styles.a} href="/login">Login</a></li>
                    <li><a className={styles.a} href="/bestellungsliste">Bestellungsliste</a></li>
                </ul>
            </Box>

            <Box sx={{ flexGrow: 1, p: 3 }}>
                {children || <Outlet />}
            </Box>
        </Box>
    );
}

export default AppShell;
