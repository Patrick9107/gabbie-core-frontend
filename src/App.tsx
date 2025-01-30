import { CssBaseline, Box, ThemeProvider, createTheme } from "@mui/material";
import Sidebar from "./app/dashboard/Sidebar.tsx";
import Header from "./app/dashboard/Header.tsx";
import Dashboard from "./app/dashboard/Dashboard.tsx";

const theme = createTheme({
    palette: {
        primary: {
            main: "#388e3c",
        },
        secondary: {
            main: "#fbc02d",
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: "flex" }}>
                <Sidebar />
                <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
                    <Header />
                    <Dashboard />
                </Box>
            </Box>
        </ThemeProvider>
    );
}

export default App;