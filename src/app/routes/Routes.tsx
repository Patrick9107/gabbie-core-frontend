import React, { useEffect, useState } from "react";
import MapComponent from "./Map";
import RouteDialog from "./RouteDialog";
// --- HINZUGEFÜGT: Alert ---
import { Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, Paper, CircularProgress, Alert } from "@mui/material";
import { Order } from "../../domain/Order.ts";
import { Stop } from "../../domain/Stop.ts";
import { useLocation } from "react-router-dom";
import { handleGetRoute } from "./RouteUtils.tsx";
import RouteSplit from "./RouteSplit.tsx";

// Die RouteState-Schnittstelle bleibt unverändert
interface RouteState {
    origin: string;
    destination: string;
    waypoints: { location: string; stopover: boolean }[];
    rawStops: Stop[];
    orderIds: number[];
}

const RoutesPage: React.FC = () => {
    const [routeData, setRouteData] = useState<RouteState | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Startet mit true
    const [openDialog, setOpenDialog] = useState(false);
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [selectedStop] = useState<Stop | null>(null);
    const [error, setError] = useState<string | null>(null);

    const location = useLocation();
    const initialOrders: Order[] = location.state?.orders || [];

    useEffect(() => {
        if (initialOrders.length > 0) {
            fetchRouteData(initialOrders);
        } else {
            setIsLoading(false); // Kein Lade-Spinner, wenn keine Bestellungen da sind
        }
    }, [initialOrders]);

    useEffect(() => {
        document.title = "Routenplanung";
    }, []);

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleDialogSave = (updatedStop: Stop) => {
        if (!routeData) return;
        const updatedStops = routeData.rawStops.map(stop =>
            stop.order.id === updatedStop.order.id ? updatedStop : stop
        );
        setRouteData({ ...routeData, rawStops: updatedStops });
        setOpenDialog(false);
    };

    const fetchRouteData = async (orders: Order[]) => {
        setIsLoading(true); // Ladeanzeige starten
        try {
            const result = await handleGetRoute(orders, "Reisenberg");
            setRouteData(result);
        } catch (error) {
            console.error("Fehler beim Abrufen der Route:", error);
            setError("Es gab ein Problem bei der Routenberechnung. Bitte überprüfen Sie die Adressen.");
            setOpenErrorDialog(true);
        } finally {
            setIsLoading(false); // Ladeanzeige beenden
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                Routenplanung & Aufteilung
            </Typography>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Route wird berechnet...</Typography>
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : initialOrders.length === 0 ? (
                <Typography variant="body1" color="text.secondary" sx={{ p: 2 }}>
                    Keine Bestellungen zur Planung ausgewählt. Bitte gehen Sie zur Bestellübersicht zurück.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {/* Karte: Behält eine feste, aber großzügige Höhe */}
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ height: '55vh', minHeight: '400px', width: '100%' }}>
                            {routeData && <MapComponent routeData={routeData} />}
                        </Paper>
                    </Grid>

                    {/* RouteSplit: Nimmt so viel Höhe wie benötigt, kein eigener Scrollbalken */}
                    <Grid item xs={12}>
                        {routeData && <RouteSplit orders={initialOrders} fixedStartAddress="Reisenberg" />}
                    </Grid>
                </Grid>
            )}

            {/* Dialoge bleiben unverändert */}
            <Dialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)}>
                <DialogTitle>Fehler bei der Routenberechnung</DialogTitle>
                <DialogContent>
                    <Typography>{error}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenErrorDialog(false)} color="primary">
                        Schließen
                    </Button>
                </DialogActions>
            </Dialog>

            <RouteDialog open={openDialog} stop={selectedStop} onClose={handleCloseDialog} onSave={handleDialogSave} />
        </Box>
    );
};

export default RoutesPage;