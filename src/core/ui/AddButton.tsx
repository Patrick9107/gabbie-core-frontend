import { Button, SxProps } from '@mui/material';
import AddIcon from "@mui/icons-material/Add";

interface props {
    onClick: () => void;
    sxCustom?: SxProps;
}

export default function AddButton({onClick, sxCustom}: props) {
    return (
        <Button
            onClick={onClick}
            variant="contained"
            sx={{...sxCustom,
                backgroundColor: "#3d9970",
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
