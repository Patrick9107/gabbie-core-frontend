import { Product } from "../../domain/Product.ts";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    InputAdornment,
    MenuItem,
    Select,
    TextField,
    FormControl,
    InputLabel,
    Stack,
    Alert
} from "@mui/material";
import { ChangeEvent, useState, useEffect } from "react";
import { Container } from "../../domain/Container.ts";

interface Props {
    open: boolean;
    edit: boolean;
    product: Product;
    onClose: () => void;
    onSubmit: () => void;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    containers: Container[];
    onContainerChange: (containerId: number | null) => void;
    apiError: string | null;
    clearApiError: () => void;
}

interface ErrorState {
    name?: string;
    price?: string;
    weight?: string;
}

const noErrors: ErrorState = {
    name: undefined,
    price: undefined,
    weight: undefined,
};

function ProductDialog({
                           open,
                           edit,
                           product,
                           onClose,
                           onSubmit,
                           onChange,
                           onContainerChange,
                           containers,
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
    }, [open, edit, product.id, apiError, clearApiError]);

    const validateForm = () => {
        const newErrors: ErrorState = {};
        if (!product.name?.trim()) newErrors.name = "Name ist erforderlich";
        const priceNum = Number(product.price);
        const weightNum = Number(product.weight);
        if (isNaN(priceNum) || priceNum <= 0) newErrors.price = "Preis muss eine Zahl größer 0 sein";
        if (isNaN(weightNum) || weightNum <= 0) newErrors.weight = "Gewicht muss eine Zahl größer 0 sein";

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
                {edit ? "Produkt bearbeiten" : "Neues Produkt erstellen"}
            </DialogTitle>
            <DialogContent>
                {apiError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {apiError}
                    </Alert>
                )}

                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        label="Name"
                        name="name"
                        fullWidth
                        margin="dense"
                        onChange={onChange}
                        value={product.name || ''}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                        autoFocus
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            label="Preis"
                            name="price"
                            type="number"
                            value={product.price}
                            fullWidth
                            margin="dense"
                            onChange={onChange}
                            error={!!errors.price}
                            helperText={errors.price}
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
                        <TextField
                            label="Gewicht"
                            name="weight"
                            type="number"
                            value={product.weight}
                            fullWidth
                            margin="dense"
                            onChange={onChange}
                            error={!!errors.weight}
                            helperText={errors.weight}
                            required
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">kg</InputAdornment>
                                },
                                htmlInput: {
                                    step: "0.01", min: "0.01"
                                }
                            }}
                        />
                    </Stack>
                    <TextField
                        label="Beschreibung"
                        name="description"
                        value={product.description || ''}
                        multiline
                        rows={3}
                        fullWidth
                        margin="dense"
                        onChange={onChange}
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            label="Bild URL"
                            name="imageUrl"
                            value={product.imageUrl || ''}
                            fullWidth
                            margin="dense"
                            onChange={onChange}
                            type="url"
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="container-select-label">Behälter</InputLabel>
                            <Select
                                labelId="container-select-label"
                                label="Behälter"
                                value={product.container?.id ?? "none"}
                                onChange={(e) =>
                                    onContainerChange(e.target.value === "none" ? null : Number(e.target.value))
                                }
                            >
                                <MenuItem value="none">
                                    <em>Keiner</em>
                                </MenuItem>
                                {containers.map((container) => (
                                    <MenuItem key={container.id} value={container.id}>
                                        {container.type} ({container.depositAmount?.toFixed(2)}€ Pfand)
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ padding: "16px 24px" }}>
                <Button onClick={handleDialogClose} color="inherit">
                    Abbrechen
                </Button>
                <Button onClick={handleDialogSubmit} variant="contained" color="primary">
                    {edit ? "Änderungen speichern" : "Produkt erstellen"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProductDialog;