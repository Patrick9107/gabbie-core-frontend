import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

function DeleteConfirmationDialog({ open, onClose, onConfirm }: Props)  {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            slotProps={{
                paper: {
                    sx: {
                        borderRadius: "12px",
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)"
                    }
                }
            }}
        >
            <DialogTitle sx={{ textAlign: "center", pt: 3, pb: 1 }}>
                <WarningAmberIcon sx={{ fontSize: 40, color: "warning.main", mb: 1 }} />
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                    Löschung bestätigen
                </Typography>
            </DialogTitle>
            <DialogContent sx={{ textAlign: "center", pb: 2, pt:1 }}>
                <Typography variant="body1" color="text.secondary">
                    Bist du sicher, dass du dieses Element endgültig löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
                </Typography>
            </DialogContent>
            <DialogActions
                sx={{
                    justifyContent: "center",
                    paddingBottom: "24px",
                    paddingX: "24px",
                    gap: "12px"
                }}
            >
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="secondary"
                    sx={{
                        flexGrow: 1,
                        borderRadius: "8px",
                        textTransform: 'none',
                        borderColor: 'grey.400',
                        color: 'text.primary'
                    }}
                >
                    Abbrechen
                </Button>
                <Button
                    onClick={onConfirm}
                    variant="contained"
                    color="error"
                    sx={{
                        flexGrow: 1,
                        borderRadius: "8px",
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: 'none',
                        }
                    }}
                    // Optional: startIcon={<DeleteIcon />} // Icon direkt im Button
                >
                    Ja, löschen
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfirmationDialog;