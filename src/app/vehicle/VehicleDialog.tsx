import { Vehicle } from "../../domain/Vehicle.ts";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    Stack,
    Alert,
    Box,
    Typography,
} from "@mui/material";
import { ChangeEvent, useState, useEffect } from "react";
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

interface Props {
    open: boolean;
    edit: boolean;
    vehicle: Vehicle;
    onClose: () => void;
    onSubmit: () => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    apiError?: string | null;
}

interface ErrorState {
    licensePlate?: string;
    capacity?: string;
}

const noErrors: ErrorState = {
    licensePlate: undefined,
    capacity: undefined,
};

function VehicleDialog({
                           open,
                           edit,
                           vehicle,
                           onClose,
                           onSubmit,
                           onChange,
                           apiError,
                       }: Props) {

    const [errors, setErrors] = useState<ErrorState>(noErrors);

    useEffect(() => {
        if (open) {
            setErrors(noErrors);
        }
    }, [open, edit, vehicle.id, apiError]);

    const validateForm = () => {
        const newErrors: ErrorState = {};
        if (!vehicle.licensePlate?.trim()) {
            newErrors.licensePlate = "Kennzeichen ist erforderlich";
        } else if (vehicle.licensePlate.trim().length < 3) {
            newErrors.licensePlate = "Kennzeichen muss mindestens 3 Zeichen lang sein";
        }


        const capacityStr = String(vehicle.capacity);
        const capacityNum = Number(capacityStr);

        if (capacityStr.trim() === "") {
            newErrors.capacity = "Kapazität ist erforderlich";
        } else if (isNaN(capacityNum) || capacityNum <= 0) {
            newErrors.capacity = "Kapazität muss eine positive Zahl sein";
        } else if (!Number.isInteger(capacityNum)) {
            newErrors.capacity = "Kapazität muss eine ganze Zahl sein";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleDialogClose = () => {
        onClose();
    };

    const handleDialogSubmit = () => {
        if (validateForm()) {
            onSubmit();
        }
    };

    const dialogTitleText = edit ? "Fahrzeug bearbeiten" : "Neues Fahrzeug erstellen";
    const TitleIconComponent = edit ? EditIcon : AddCircleOutlineIcon;

    return (
        <Dialog
            open={open}
            onClose={handleDialogClose}
            maxWidth="sm"
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
                        label="Kennzeichen"
                        name="licensePlate"
                        value={vehicle.licensePlate || ''}
                        fullWidth
                        margin="dense"
                        onChange={onChange}
                        error={!!errors.licensePlate}
                        helperText={errors.licensePlate}
                        required
                        autoFocus={!edit}
                        variant="outlined"
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            }
                        }}
                    />
                    <TextField
                        label="Kapazität"
                        name="capacity"
                        type="number"
                        value={vehicle.capacity || ''}
                        fullWidth
                        margin="dense"
                        onChange={onChange}
                        error={!!errors.capacity}
                        helperText={errors.capacity}
                        required
                        variant="outlined"
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                            input: {
                                inputProps: {
                                    min: 1,
                                    step: 1
                                }
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
                    {edit ? "Änderungen speichern" : "Fahrzeug erstellen"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default VehicleDialog;