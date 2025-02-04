import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export default function AddButton() {
    return (
        <Button
            variant="contained"
            sx={{
                backgroundColor: "#16a34a",
                borderRadius: "20px",
                minWidth: "60px",
                minHeight: "20px",
                padding: "8px",
                "&:hover": {
                    backgroundColor: "#128a3b"
                }
            }}
        >
            <AddIcon sx={{ color: "white", fontSize: 32  }} />
        </Button>
    );
}
