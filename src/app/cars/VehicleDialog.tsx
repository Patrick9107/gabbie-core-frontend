import { Vehicle } from "../../domain/Vehicle.ts";
import { VehicleStatus } from "../../domain/enums/VehicleStatus.ts";
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, MenuItem, Select } from "@mui/material";
import { ChangeEvent } from "react";

interface Props {
    open: boolean;
    edit: boolean;
    vehicle: Vehicle;
    onClose: () => void;
    onSubmit: () => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onStatusChange: (status: VehicleStatus) => void;
}

function VehicleDialog({ open, edit, vehicle, onClose, onSubmit, onChange, onStatusChange }: Props) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{edit ? "Fahrzeug bearbeiten" : "Neues Fahrzeug"}</DialogTitle>
            <DialogContent>
                <TextField
                    label="Kennzeichen"
                    name="licensePlate"
                    value={vehicle.licensePlate}
                    fullWidth
                    margin="dense"
                    onChange={onChange}
                />
                <TextField
                    label="Kapazität"
                    name="capacity"
                    type="number"
                    value={vehicle.capacity}
                    fullWidth
                    margin="dense"
                    onChange={onChange}
                />
                <Select
                    value={vehicle.status}
                    fullWidth
                    onChange={(e) => onStatusChange(e.target.value as VehicleStatus)}
                    displayEmpty
                >
                    <MenuItem value="" disabled>Status auswählen</MenuItem>
                    {Object.values(VehicleStatus).map(status => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">Abbrechen</Button>
                <Button onClick={onSubmit} color="success">Speichern</Button>
            </DialogActions>
        </Dialog>
    );
}

export default VehicleDialog;
