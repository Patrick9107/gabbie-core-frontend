import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface props {
    onClick: () => void;
}

export default function AddButton({onClick}: props) {
    return (
        <Button
            onClick={onClick}
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
