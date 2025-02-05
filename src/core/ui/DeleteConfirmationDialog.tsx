import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

function DeleteConfirmationDialog({ open, onClose, onConfirm }: Props)  {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
    Löschung bestätigen
    </DialogTitle>
    <DialogContent>
    <Typography variant="body1" sx={{ textAlign: "center", padding: "8px" }}>
    Bist du sicher, dass du dieses Element löschen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.
    </Typography>
    </DialogContent>
    <DialogActions sx={{ justifyContent: "center", paddingBottom: "16px" }}>
    <Button onClick={onClose} variant="outlined" color="secondary">
        Abbrechen
        </Button>
        <Button onClick={onConfirm} variant="contained" color="error">
        Ja, löschen
    </Button>
    </DialogActions>
    </Dialog>
);
};

export default DeleteConfirmationDialog;
