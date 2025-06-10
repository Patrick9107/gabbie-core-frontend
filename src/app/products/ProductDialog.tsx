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
    Alert,
    Box,
    Typography,
    SelectChangeEvent
} from "@mui/material";
import { ChangeEvent, useState, useEffect } from "react";
import { Container } from "../../domain/Container.ts";
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
    onImageChange: (file: File | null) => void; // NEU
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
                           clearApiError,
                           onImageChange
                       }: Props) {

    const [errors, setErrors] = useState<ErrorState>(noErrors);
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setErrors(noErrors);
            if (apiError) {
                clearApiError();
            }
            setSelectedFileName(product.imageUrl || null);
        }
    }, [open, edit, product.id, product.imageUrl, apiError, clearApiError]);

    const validateForm = () => {
        const newErrors: ErrorState = {};
        if (!product.name?.trim()) newErrors.name = "Name ist erforderlich";

        const priceStr = String(product.price).replace(',', '.');
        const weightStr = String(product.weight).replace(',', '.');

        const priceNum = Number(priceStr);
        const weightNum = Number(weightStr);

        if (String(product.price).trim() === "") {
            newErrors.price = "Preis ist erforderlich";
        } else if (isNaN(priceNum) || priceNum <= 0) {
            newErrors.price = "Preis muss eine positive Zahl sein";
        }

        if (String(product.weight).trim() === "") {
            newErrors.weight = "Gewicht ist erforderlich";
        } else if (isNaN(weightNum) || weightNum <= 0) {
            newErrors.weight = "Gewicht muss eine positive Zahl sein";
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

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFileName(file.name);

            onChange({
                target: {
                    name: "imageUrl",
                    value: file.name
                }
            } as unknown as ChangeEvent<HTMLInputElement>);

            onImageChange(file); // NEU
        } else {
            setSelectedFileName(null);
            onChange({
                target: {
                    name: "imageUrl",
                    value: ""
                }
            } as unknown as ChangeEvent<HTMLInputElement>);

            onImageChange(null); // NEU
        }
    };

    const dialogTitleText = edit ? "Produkt bearbeiten" : "Neues Produkt erstellen";
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
                        label="Name"
                        name="name"
                        fullWidth
                        onChange={onChange}
                        value={product.name || ''}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                        autoFocus
                        variant="outlined"
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            }
                        }}
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                        <TextField
                            label="Preis"
                            name="price"
                            type="number"
                            value={product.price || ''}
                            fullWidth
                            onChange={onChange}
                            error={!!errors.price}
                            helperText={errors.price}
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
                        <TextField
                            label="Gewicht"
                            name="weight"
                            type="number"
                            value={product.weight || ''}
                            fullWidth
                            onChange={onChange}
                            error={!!errors.weight}
                            helperText={errors.weight}
                            required
                            variant="outlined"
                            slotProps={{
                                inputLabel: {
                                    shrink: true
                                },
                                input: {
                                    endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                                    inputProps: { step: "0.01", min: "0.01" }
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
                        onChange={onChange}
                        variant="outlined"
                        slotProps={{
                            inputLabel: {
                                shrink: true
                            }
                        }}
                    />

                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2.5}
                        alignItems="flex-start"
                        sx={{
                            '& > *': {
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: 1,
                            }
                        }}
                    >
                        {/* File Upload */}
                        <FormControl fullWidth variant="outlined" sx={{ flex: 1 }}>
                            <InputLabel htmlFor="file-upload-input" shrink={true}>Bild hochladen</InputLabel>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: '8px',
                                    padding: '16.5px 14px',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    minHeight: '56px',
                                    '&:hover': {
                                        borderColor: 'action.active',
                                    },
                                    '&:focus-within': {
                                        borderColor: 'primary.main',
                                        borderWidth: '2px',
                                    }
                                }}
                                component="label"
                                htmlFor="file-upload-input"
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    id="file-upload-input"
                                    onChange={handleFileChange}
                                    key={product.id}
                                />
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CloudUploadIcon color="action" />
                                    <Typography variant="body1" color="text.secondary">
                                        {selectedFileName || product.imageUrl || "Datei auswählen"}
                                    </Typography>
                                </Stack>
                            </Box>
                        </FormControl>

                        {/* Container Select */}
                        <FormControl fullWidth variant="outlined" sx={{ flex: 1 }}>
                            <InputLabel id="container-select-label" shrink={true}>Behälter</InputLabel>
                            <Select
                                labelId="container-select-label"
                                label="Behälter"
                                value={product.container?.id ?? "none"}
                                onChange={(e: SelectChangeEvent<number | "none">) =>
                                    onContainerChange(e.target.value === "none" ? null : Number(e.target.value))
                                }
                                displayEmpty
                            >
                                <MenuItem value="none">
                                    <em>Keinen auswählen</em>
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
                    {edit ? "Änderungen speichern" : "Produkt erstellen"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProductDialog;
