import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from "@mui/material";
import AddressList from "./HistoryList.tsx";
import { API_BASE_URL } from "../../../apiConfig";
import ExportToExcelButton from "./ExportToExcelButton";
import ExportLadelisteButton from "./LadelisteExport";

interface Props {
    open: boolean;
    onClose: () => void;
    routeId: number;
}

function AddressDialog({ open, onClose, routeId }: Props) {
    const [stops, setStops] = useState<any[]>([]);
    const [routeData, setRouteData] = useState<string>("");

    useEffect(() => {
        const fetchRouteData = async () => {
            if (!routeId || routeId === 0) return;

            try {
                const response = await fetch(`${API_BASE_URL}/Route/${routeId}`);
                if (!response.ok) throw new Error(`Fehler: ${response.status}`);

                const route = await response.json();
                if (route?.routeData) {
                    setRouteData(route.routeData); // Zum Exportieren speichern
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
                            <AddressList stops={stops} routeId={routeId} />
                        ) : (
                            <p>Keine Adressen verfügbar</p>
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "space-between", px: 3 }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                    {routeData && <ExportLadelisteButton routeData={routeData} />}
                    {routeData && <ExportToExcelButton routeData={routeData} />}
                </Box>
                <Button onClick={onClose} color="success">Schließen</Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddressDialog;
