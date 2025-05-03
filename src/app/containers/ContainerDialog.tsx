import { Container } from "../../domain/Container.ts";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, InputAdornment,
    TextField,
} from "@mui/material";
import { ChangeEvent, useState } from "react";

interface Props {
    open: boolean;
    edit: boolean;
    container: Container;
    onClose: () => void;
    onSubmit: () => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function ContainerDialog({ open, edit, container, onClose, onSubmit, onChange }: Props) {
    interface error {
        type?: string;
        depositAmount?: string;
    }

    const noErrors = {
        type: "",
        depositAmount: ""
    };

    const [errors, setErrors] = useState<error>(noErrors);

    // Überprüft, ob alle erforderlichen Felder ausgefüllt sind
    const validateForm = () => {
        const newErrors: error = {};
        if (!container.depositAmount) newErrors.depositAmount = "Pfandpreis ist erforderlich";
        if (!container.type) newErrors.type = "Typ ist erforderlich";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onCloseDialog = () => {
        setErrors(noErrors);
        onClose();
    }

    // Form submit Handler
    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit();
        }
    };

    return (
        <Dialog open={open} onClose={onCloseDialog}>
            <DialogTitle>{edit ? "Behälter bearbeiten" : "Neuer Behälter"}</DialogTitle>
            <DialogContent>
                <Box sx={{ display: "flex", gap: "8px", marginY: "4px" }}>
                    <TextField
                        label="Typ"
                        name="type"
                        type="string"
                        value={container.type}
                        fullWidth
                        margin="dense"
                        onChange={onChange}
                        error={!!errors.type}
                        helperText={errors.type}
                    />
                    <TextField
                        label="Pfandpreis"
                        name="depositAmount"
                        type="number"
                        value={container.depositAmount}
                        fullWidth
                        margin="dense"
                        onChange={onChange}
                        error={!!errors.depositAmount}
                        helperText={errors.depositAmount}
                        slotProps={{
                            input: {
                                endAdornment: <InputAdornment position="end">€</InputAdornment>
                            }
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">
                    Abbrechen
                </Button>
                <Button onClick={handleSubmit} color="success">
                    Speichern
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ContainerDialog;
