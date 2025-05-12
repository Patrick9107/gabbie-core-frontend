import React, { useState, useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, FormControl, InputLabel, CircularProgress } from "@mui/material";
import { API_BASE_URL } from "../../../apiConfig.ts";
import { RouteState } from "../../domain/RouteState.ts";
//import { Stop } from "../../domain/Stop.ts"; // Entfernt, da RouteState verwendet wird
import { format, addMinutes } from 'date-fns';
import { de } from 'date-fns/locale';

interface SaveRouteProps {
    routeData: RouteState | null;
    routeStartTime: string; // Add routeStartTime prop
}

const SaveRoute: React.FC<SaveRouteProps> = ({ routeData, routeStartTime }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState<string>("");
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState(false); // Für den Speichern-Status

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

    const parseTimeStringToDate = (timeString: string, baseDate: Date): Date => {
        const [hours, minutes] = timeString.split(":").map(Number);
        const date = new Date(baseDate); // Verwende eine Kopie, um baseDate nicht zu ändern
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    };

    const patchOrderTimeWindows = async (orderTimeWindows: Record<number, { startDate: string | null; endDate: string | null }>) => {
        try {
            for (const orderId in orderTimeWindows) {
                const { startDate, endDate } = orderTimeWindows[parseInt(orderId)];

                const response = await fetch(`${API_BASE_URL}/Order/${orderId}/TimeWindow?startDate=${startDate}&endDate=${endDate}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    // Handle Fehler für jeden einzelnen Patch-Aufruf
                    console.error(`Failed to update order ${orderId}:`, await response.text());
                    alert(`Failed to update order ${orderId}. Please check the console for details.`); // Optional: Benutzer benachrichtigen
                    return false; // Wichtig: Abbruch bei Fehler, damit nicht alle Aufträge aktualisiert werden, wenn einer fehlschlägt
                }
            }
            return true; // Alle Aufträge erfolgreich aktualisiert
        } catch (error) {
            console.error("Error saving route:", error);
            alert("Failed to save route. Please check the console for details.");
            return false;
        }
    };

    const handleSaveRoute = async () => {
        if (!routeData || !selectedVehicle) return;

        setIsSaving(true); // Setze den Status auf "Speichern..."
        setLoading(true); // Zusätzlich, falls im Dialog noch Ladezustände sind

        // Erstellen Sie das orderTimeWindows-Objekt für die Patch-Anfragen
        const orderTimeWindows: Record<number, { startDate: string | null; endDate: string | null }> = {};

        // Sicherstellen, dass routeStartTime einen Wert hat, bevor split aufgerufen wird.
        if (routeStartTime) {
            const [startHours, startMinutes] = routeStartTime.split(":").map(Number);
            let routeStartDate = new Date();
            routeStartDate.setHours(startHours);
            routeStartDate.setMinutes(startMinutes);
            routeStartDate.setSeconds(0);
            routeStartDate.setMilliseconds(0);


            routeData.rawStops.forEach((stop) => {
                if (stop.order.id) {
                    let previousArrivalTime = 0;
                    // Verwende die vorherige Ankunftszeit, falls vorhanden
                    const currentStopIndex = routeData.rawStops.findIndex(s => s.order.id === stop.order.id);
                    if (currentStopIndex > 0) {
                        let time = 0;
                        for (let i = 0; i < currentStopIndex; i++) {
                            time += routeData.rawStops[i].arrival
                        }
                        previousArrivalTime = time;
                    }
                    const arrivalTime = addMinutes(routeStartDate, previousArrivalTime);
                    const lowerBound = format(addMinutes(arrivalTime, -60), 'HH:mm', { locale: de });
                    const upperBound = format(addMinutes(arrivalTime, 60), 'HH:mm', { locale: de });

                    const startDate = lowerBound ? parseTimeStringToDate(lowerBound, arrivalTime).toISOString() : null;
                    const endDate = upperBound ? parseTimeStringToDate(upperBound, arrivalTime).toISOString() : null;

                    orderTimeWindows[stop.order.id] = { startDate, endDate };
                }
            });

            // Führe die Patch-Anfragen für die Aufträge durch
            const ordersUpdated = await patchOrderTimeWindows(orderTimeWindows);

            if (!ordersUpdated) {
                setIsSaving(false);
                setLoading(false);
                return; // Beende den Vorgang, wenn das Patchen der Aufträge fehlschlägt
            }

            // Wenn die Aufträge erfolgreich gepatcht wurden, fahre mit dem Speichern der Route fort
            const routePayload = {
                totalDuration: routeData.rawStops.reduce((sum, stop) => sum + stop.arrival, 0),
                totalDistance: routeData.rawStops.reduce((sum, stop) => sum + stop.distance, 0),
                startTime: routeStartDate.toISOString(),
                endTime: new Date(routeStartDate.getTime() + routeData.rawStops.reduce((sum, stop) => sum + stop.arrival, 0) * 60000).toISOString(),
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

                const vehicleToUpdate = vehicles.find(vehicle => vehicle.id === selectedVehicle);

                if (!vehicleToUpdate) {
                    throw new Error("Selected vehicle not found");
                }

                const updateVehicleResponse = await fetch(`${API_BASE_URL}/Vehicle/${selectedVehicle}`, {
                    method: "PUT", // oder PATCH, je nach API-Definition
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        licensePlate: vehicleToUpdate.licensePlate,
                        capacity: vehicleToUpdate.capacity,
                        status: vehicleToUpdate.status,
                        routeId: savedRoute.id,
                    }),
                });

                if (!updateVehicleResponse.ok) {
                    throw new Error("Failed to update vehicle with routeId");
                }

                console.log("Vehicle updated successfully with new routeId.");
                setOpenDialog(false); // Schließe den Dialog nur, wenn alles erfolgreich war

            } catch (error) {
                console.error("Error saving route or updating vehicle:", error);
                alert("Failed to save route. Please check the console for details."); // Benutzer benachrichtigen
            } finally {
                setIsSaving(false); // Unabhängig vom Erfolg, setze isSaving zurück
                setLoading(false);
            }
        }
        else{
            console.error("routeStartTime is undefined");
            alert("routeStartTime is undefined.  Please provide a valid start time.");
            setIsSaving(false);
            setLoading(false);
        }
    };

    return (
        <div>
            {routeData && (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenDialog(true)}
                    disabled={isSaving} // Disable den Button während des Speicherns
                >
                    {isSaving ? "Saving..." : "Route speichern"}
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
                                disabled={isSaving} // Disable das Select-Feld während des Speicherns
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
                    <Button onClick={() => setOpenDialog(false)} color="primary" disabled={isSaving}>
                        Abbrechen
                    </Button>
                    <Button onClick={handleSaveRoute} variant="contained" color="primary" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Speichern"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SaveRoute;

