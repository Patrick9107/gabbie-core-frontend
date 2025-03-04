import { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig.ts";

interface AssignRouteButtonProps {
    vehicleId: number;
    licensePlate: string;
    capacity: number;
    status: number;
}

const AssignRouteButton: React.FC<AssignRouteButtonProps> = ({ vehicleId, licensePlate, capacity, status }) => {
    const [open, setOpen] = useState(false);
    const [routeId, setRouteId] = useState("");
    const [message, setMessage] = useState("");

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setMessage("");
    };

    const handleAssignRoute = async () => {
        if (!routeId) {
            setMessage("Bitte eine route ID eintippen.");
            return;
        }

        try {
            const vehicleData = {
                licensePlate,
                capacity,
                status,
                routeId: Number(routeId), 
            };
            
            await axios.put(`${API_BASE_URL}/vehicle/${vehicleId}`, vehicleData);

            console.log("Route passt");
            handleClose();
        } catch (error) {
            console.error(error);
            setMessage("Error assigning route.");
        }
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Assign Route
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Assign Route to Vehicle</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Route ID"
                        type="number"
                        fullWidth
                        value={routeId}
                        onChange={(e) => setRouteId(e.target.value)}
                    />
                    {message && <p style={{ color: "red" }}>{message}</p>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAssignRoute} color="primary">
                        Assign
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default AssignRouteButton;
