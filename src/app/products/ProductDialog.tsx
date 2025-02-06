import {Product} from "../../domain/Product.ts";
import {
    Box,
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle, MenuItem, Select, TextField
} from "@mui/material";
import {ChangeEvent} from "react";
import {Container} from "../../domain/Container.ts";

interface Props {
    open: boolean;
    edit: boolean;
    product: Product;
    onClose: () => void;
    onSubmit: () => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    containers: Container[];
    onContainerChange: (containerId: number | null) => void;
}

function ProductDialog({open, edit, product, onClose, onSubmit, onChange, containers, onContainerChange}: Props) {

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{edit ? "Produkt bearbeiten" : "Neues Produkt"}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Name"
                    name="name"
                    value={product.name}
                    fullWidth
                    margin="dense"
                    onChange={onChange}
                />
                <Box sx={{ display: "flex", gap: "8px", marginY: "4px" }}>
                    <TextField
                        label="Preis"
                        name="price"
                        type="number"
                        value={edit ? product.price : null}
                        fullWidth
                        margin="dense"
                        onChange={onChange}
                    />
                    <TextField
                        label="Gewicht"
                        name="weight"
                        type="number"
                        value={edit ? product.weight : null}
                        fullWidth
                        margin="dense"
                        onChange={onChange}
                    />
                </Box>
                <TextField
                    label="Beschreibung (optional)"
                    name="description"
                    value={product.description}
                    multiline rows={3}
                    fullWidth
                    margin="dense"
                    onChange={onChange}
                />
                <Box sx={{ display: "flex", gap: "8px", marginY: "4px" }}>
                {/*todo, maybe file upload?? idk*/}
                <TextField
                    label="Bild URL"
                    name="imageUrl"
                    value={product.imageUrl}
                    fullWidth
                    margin="dense"
                    onChange={onChange}
                />
                    <Select value={product.container === undefined ? "" : product.container?.id ?? "none"} displayEmpty fullWidth onChange={(e) => onContainerChange(e.target.value === "none" ? null : Number(e.target.value))}>
                        <MenuItem value="" disabled>Behälter auswählen</MenuItem>
                        <MenuItem value="none"> Keiner </MenuItem>
                        {containers.map(container => (
                            <MenuItem key={container.id} value={container.id}> {container.type} </MenuItem>
                        ))}
                    </Select>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">Abbrechen</Button>
                <Button onClick={onSubmit} color="success">Speichern</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProductDialog;