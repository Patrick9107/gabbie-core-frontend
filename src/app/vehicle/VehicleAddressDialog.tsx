import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import AddressList from "../routes/AddressList.tsx";
import { API_BASE_URL } from "../../../apiConfig";

interface Props {
    open: boolean;
    onClose: () => void;
    routeId: number;
}

function AddressDialog({ open, onClose, routeId }: Props) {
    const [stops, setStops] = useState<any[]>([]);


    useEffect(() => {
        const fetchRouteData = async () => {
            if (!routeId || routeId === 0) return;

            try {
                const response = await fetch(`${API_BASE_URL}/Route/${routeId}`);
                if (!response.ok) throw new Error(`Fehler: ${response.status}`);

                const route = await response.json();
                if (route?.routeData) {
                    try {
                        const parsedData = JSON.parse(route.routeData);
                        setStops(parsedData.rawStops || []);
                    } catch (error) {
                        console.error("Fehler beim Parsen der Route:", error);
                        setStops([]);
                    }
                }
            } catch (error) {
                console.error("Fehler beim Abrufen der Route:", error);
                setStops([]);
            }
        };

        if (open && routeId && routeId !== 0) {
            fetchRouteData();
        }
    }, [open, routeId]);
    
    if (!routeId || routeId === 0) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>
                {routeId && routeId !== 0 ? `Adressen für Route ${routeId}` : "Adressen"}
            </DialogTitle>
            <DialogContent>
                {routeId === 0 ? (
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => alert("Keine Route zugewiesen")}
                    >
                        Keine Route
                    </Button>
                ) : (
                    <>
                        {stops.length > 0 ? (
                            <>
                                <AddressList
                                    stops={stops}
                                    handleStatusChange={() => {}}
                                    handleExportToGoogleMaps={() => {}}
                                />
                            </>
                        ) : (
                            <p>Keine Adressen verfügbar</p>
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Schließen</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddressDialog;
