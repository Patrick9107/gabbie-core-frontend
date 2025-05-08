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
    Alert,
    Box,
    Typography
} from "@mui/material";
import { ChangeEvent, useState, useEffect } from "react";
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

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

        if (!container.type?.trim()) {
            newErrors.type = "Typ ist erforderlich";
        }

        const depositStr = String(container.depositAmount).replace(',', '.');
        const depositNum = Number(depositStr);

        if (String(container.depositAmount).trim() === "") {
            newErrors.depositAmount = "Pfandpreis ist erforderlich";
        } else if (isNaN(depositNum) || depositNum <= 0) {
            newErrors.depositAmount = "Pfandpreis muss eine positive Zahl sein";
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

    const dialogTitleText = edit ? "Behälter bearbeiten" : "Neuen Behälter erstellen";
    const TitleIconComponent = edit ? EditIcon : AddCircleOutlineIcon;


    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}
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
            <DialogTitle sx={{ pt: 3, pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
                    <TitleIconComponent sx={{ fontSize: 36, color: "primary.main" }} />
                    <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                        {dialogTitleText}
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 2, pb: 2 }}>
                {apiError && (
                    <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
                        {apiError}
                    </Alert>
                )}
                <Stack spacing={2.5} sx={{ mt: apiError ? 0 : 1 }}>
                    <TextField
                        label="Typ"
                        name="type"
                        fullWidth
                        onChange={onChange}
                        value={container.type || ''}
                        error={!!errors.type}
                        helperText={errors.type}
                        required
                        autoFocus
                        variant="outlined"
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            }
                        }}
                    />
                    <TextField
                        label="Pfandpreis"
                        name="depositAmount"
                        type="number"
                        fullWidth
                        onChange={onChange}
                        value={container.depositAmount || ''}
                        error={!!errors.depositAmount}
                        helperText={errors.depositAmount}
                        required
                        variant="outlined"
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            },
                            input: {
                                endAdornment: <InputAdornment position="end">€</InputAdornment>,
                                inputProps: { step: "0.01", min: "0.01" }
                            }
                        }}
                    />
                </Stack>
            </DialogContent>
            <DialogActions
                sx={{
                    justifyContent: "flex-end",
                    paddingBottom: "24px",
                    paddingTop: "16px",
                    paddingX: "24px",
                    gap: "12px"
                }}
            >
                <Button
                    onClick={handleDialogClose}
                    variant="outlined"
                    color="secondary"
                    sx={{ borderRadius: "8px", textTransform: 'none', borderColor: 'grey.400', color: 'text.primary' }}
                >
                    Abbrechen
                </Button>
                <Button
                    onClick={handleDialogSubmit}
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: "8px", textTransform: 'none' }}
                >
                    {edit ? "Änderungen speichern" : "Behälter erstellen"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ContainerDialog;