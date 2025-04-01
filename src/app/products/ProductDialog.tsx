import { Product } from "../../domain/Product.ts";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, InputAdornment,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { ChangeEvent, useState } from "react";
import { Container } from "../../domain/Container.ts";

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

function ProductDialog({ open, edit, product, onClose, onSubmit, onChange, onContainerChange, containers }: Props) {
    interface error {
        name?: string;
        price?: string;
        weight?: string;
    }

    const noErrors = {
        name: "",
        price: "",
        weight: "",
    };

    const [errors, setErrors] = useState<error>(noErrors);

    // Überprüft, ob alle erforderlichen Felder ausgefüllt sind
    const validateForm = () => {
        const newErrors: error = {};
        if (!product.name) newErrors.name = "Name ist erforderlich";
        if (!product.price) newErrors.price = "Preis ist erforderlich";
        if (!product.weight) newErrors.weight = "Gewicht ist erforderlich";
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
          <DialogTitle>{edit ? "Produkt bearbeiten" : "Neues Produkt"}</DialogTitle>
          <DialogContent>
              <TextField
                label="Name"
                name="name"
                fullWidth
                margin="dense"
                onChange={onChange}
                value={product.name}
                error={!!errors.name}
                helperText={errors.name}
              />
              <Box sx={{ display: "flex", gap: "8px", marginY: "4px" }}>
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
                    slotProps={{
                        input: {
                            endAdornment: <InputAdornment position="end">€</InputAdornment>
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
                      slotProps={{
                          input: {
                              endAdornment: <InputAdornment position="end">kg</InputAdornment>
                          }
                      }}
                  />
              </Box>
              <TextField
                label="Beschreibung (optional)"
                name="description"
                value={product.description}
                multiline
                rows={3}
                fullWidth
                margin="dense"
                onChange={onChange}
              />
              <Box sx={{ display: "flex", gap: "8px", marginY: "4px" }}>
                  <TextField
                    label="Bild URL"
                    name="imageUrl"
                    value={product.imageUrl}
                    fullWidth
                    margin="dense"
                    onChange={onChange}
                  />
                  <Select
                    value={product.container === undefined ? "" : product.container?.id ?? "none"}
                    displayEmpty
                    fullWidth
                    onChange={(e) =>
                      onContainerChange(e.target.value === "none" ? null : Number(e.target.value))
                    }
                  >
                      <MenuItem value="" disabled>
                          Behälter auswählen
                      </MenuItem>
                      <MenuItem value="none">Keiner</MenuItem>
                      {containers.map((container) => (
                        <MenuItem key={container.id} value={container.id}>
                            {container.type}
                        </MenuItem>
                      ))}
                  </Select>
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

export default ProductDialog;
