import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, FormControl, InputLabel, CircularProgress } from "@mui/material";
import { API_BASE_URL } from "../../../apiConfig.ts";
import { RouteState } from "../../domain/RouteState.ts";

interface SaveRouteProps {
    routeData: RouteState | null;
}

const SaveRoute: React.FC<SaveRouteProps> = ({ routeData }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<string>("");
    const [vehicles, setVehicles] = useState<any[]>([]); 
    const [loading, setLoading] = useState<boolean>(false);
    
    useEffect(() => {
        const fetchVehicles = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/Vehicle`);
                if (!response.ok) {
                    throw new Error("Failed to fetch vehicles");
                }
                const data = await response.json();
                setVehicles(data);
            } catch (error) {
                console.error("Error fetching vehicles:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    const handleSaveRoute = async () => {
        if (!routeData || !selectedVehicle) return;

        const routePayload = {
            totalDuration: routeData.rawStops.reduce((sum, stop) => sum + stop.arrival, 0),
            totalDistance: routeData.rawStops.reduce((sum, stop) => sum + stop.distance, 0),
            startTime: new Date().toISOString(),
            endTime: new Date(new Date().getTime() + routeData.rawStops.reduce((sum, stop) => sum + stop.arrival, 0) * 60000).toISOString(),
            routeData: JSON.stringify(routeData),
            vehicleId: selectedVehicle, 
        };

        try {
            const response = await fetch(`${API_BASE_URL}/Route`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(routePayload),
            });

            if (!response.ok) {
                throw new Error("Failed to save route");
            }

            const savedRoute = await response.json();
            console.log("Route saved successfully:", savedRoute);
            setOpenDialog(false); 
        } catch (error) {
            console.error("Error saving route:", error);
        }
    };

    return (
        <div>
            {routeData && (
                <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                    Route speichern
                </Button>
            )}

            <Dialog 
                open={openDialog} 
                onClose={() => setOpenDialog(false)}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Fahrzeug zuweisen</DialogTitle>
                <DialogContent>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <FormControl fullWidth>
                            <InputLabel>Wählen Sie ein Fahrzeug</InputLabel>
                            <Select
                                value={selectedVehicle}
                                onChange={(e) => setSelectedVehicle(e.target.value)}
                                label="Fahrzeug auswählen"
                            >
                                {vehicles.map((vehicle) => (
                                    <MenuItem key={vehicle.id} value={vehicle.id}>
                                        {vehicle.licensePlate}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        Abbrechen
                    </Button>
                    <Button onClick={handleSaveRoute} color="primary">
                        Speichern
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SaveRoute;
