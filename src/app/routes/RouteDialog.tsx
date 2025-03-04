import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { Stop} from "../../domain/Stop.ts"

interface RouteDialogProps {
    open: boolean;
    stop: Stop | null;
    onClose: () => void;
    onSave: (updatedStop: Stop) => void;
}

const RouteDialog: React.FC<RouteDialogProps> = ({ open, stop, onClose, onSave }) => {
    const [editedStop, setEditedStop] = React.useState<Stop | null>(stop);

    React.useEffect(() => {
        setEditedStop(stop);
    }, [stop]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Details für {editedStop?.name}</DialogTitle>
            <DialogContent>
                <TextField label="Anzahl Produkte" type="number" fullWidth margin="dense"
                           value={editedStop?.products || ""}
                           onChange={(e) => setEditedStop({ ...editedStop!, products: e.target.value })}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Abbrechen</Button>
                <Button variant="contained" onClick={() => onSave(editedStop!)}>Speichern</Button>
            </DialogActions>
        </Dialog>
    );
};

export default RouteDialog;
