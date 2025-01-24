import { AppBar, Toolbar, Typography, Avatar, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function Header() {
    return (
        <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{ borderBottom: "1px solid #e0e0e0" }}
        >
            <Toolbar>
                <Typography variant="h6" noWrap sx={{ flex: 1 }}>
                    Dashboard
                </Typography>
                <IconButton>
                    <SearchIcon />
                </IconButton>
                <Avatar sx={{ ml: 2 }}>A</Avatar>
            </Toolbar>
        </AppBar>
    );
}

export default Header;