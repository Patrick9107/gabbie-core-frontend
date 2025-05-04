import { Container } from "../../domain/Container.ts";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    TextField,
    Stack,
    Alert
} from "@mui/material";
import { ChangeEvent, useState, useEffect } from "react";

interface Props {
    open: boolean;
    edit: boolean;
    container: Container;
    onClose: () => void;
    onSubmit: () => void;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    apiError: string | null;
    clearApiError: () => void;
}

interface ErrorState {
    type?: string;
    depositAmount?: string;
}

const noErrors: ErrorState = {
    type: undefined,
    depositAmount: undefined,
};

function ContainerDialog({
                             open,
                             edit,
                             container,
                             onClose,
                             onSubmit,
                             onChange,
                             apiError,
                             clearApiError
                         }: Props) {

    const [errors, setErrors] = useState<ErrorState>(noErrors);

    useEffect(() => {
        if (open) {
            setErrors(noErrors);
            if (apiError) {
                clearApiError();
            }
        }
    }, [open, edit, container.id, apiError, clearApiError]);

    const validateForm = () => {
        const newErrors: ErrorState = {};
        const depositNum = Number(container.depositAmount);

        if (!container.type?.trim()) {
            newErrors.type = "Typ ist erforderlich";
        }
        if (isNaN(depositNum) || depositNum <= 0) {
            newErrors.depositAmount = "Pfandpreis muss eine Zahl größer 0 sein";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDialogClose = () => {
        onClose();
    };

    const handleDialogSubmit = () => {
        clearApiError();
        if (validateForm()) {
            onSubmit();
        }
    };

    return (
        <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 'medium' }}>
                {edit ? "Behälter bearbeiten" : "Neuen Behälter erstellen"}
            </DialogTitle>
            <DialogContent>
                {apiError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {apiError}
                    </Alert>
                )}

                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Typ"
                        name="type"
                        fullWidth
                        margin="dense"
                        onChange={onChange}
                        value={container.type || ''}
                        error={!!errors.type}
                        helperText={errors.type}
                        required
                        autoFocus
                    />
                    <TextField
                        label="Pfandpreis"
                        name="depositAmount"
                        type="number"
                        fullWidth
                        margin="dense"
                        onChange={onChange}
                        value={container.depositAmount}
                        error={!!errors.depositAmount}
                        helperText={errors.depositAmount}
                        required
                        slotProps={{
                            input: {
                              endAdornment: <InputAdornment position="end">€</InputAdornment>
                            },
                            htmlInput: {
                                step: "0.01", min: "0.01"
                            }
                        }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ padding: "16px 24px" }}>
                <Button onClick={handleDialogClose} color="inherit">
                    Abbrechen
                </Button>
                <Button onClick={handleDialogSubmit} variant="contained" color="primary">
                    {edit ? "Änderungen speichern" : "Behälter erstellen"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ContainerDialog;