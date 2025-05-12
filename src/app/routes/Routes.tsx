import React, { useEffect, useState } from "react";
import AddressInput from "./AddressInput";
import MapComponent from "./Map";
import RouteDialog from "./RouteDialog";
import SaveRoute from "./SaveRoute";
import { Box, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { Order } from "../../domain/Order.ts";
import { Stop } from "../../domain/Stop.ts";
import { useLocation } from "react-router-dom";
import { handleGetRoute } from "./RouteUtils.tsx";
import RouteSplit from "./RouteSplit.tsx";

interface RouteState {
    origin: string;
    destination: string;
    waypoints: { location: string; stopover: boolean }[];
    rawStops: Stop[];
    orderIds: number[];
}

const RoutesPage: React.FC = () => {
    const [routeData, setRouteData] = useState<RouteState | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openErrorDialog, setOpenErrorDialog] = useState(false);
    const [selectedStop] = useState<Stop | null>(null);
    const [error, setError] = useState<string | null>(null);

    const location = useLocation();
    const initialOrders: Order[] = location.state?.orders || [];

    useEffect(() => {
        if (initialOrders.length > 0) {
            fetchRouteData(initialOrders);
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
        try {
            await new Promise(resolve => setTimeout(resolve, 10000));
            const result = await handleGetRoute(orders, "Reisenberg");
            setRouteData(result);
        } catch (error) {
            console.error("Fehler beim Abrufen der Route:", error);
            setError("Es gab ein Problem bei der Routenberechnung. Bitte überprüfen Sie die Adressen.");
            setOpenErrorDialog(true);  // Show the error dialog
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", p: 2 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                Routenplanung
            </Typography>

            <Box sx={{ display: "flex", height: "70vh" }}>
                <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {routeData && <MapComponent routeData={routeData} />}
                </Box>
                <Box sx={{ width: 300, p: 2, border: "1px solid #ddd", borderRadius: "8px" }}>
                    <AddressInput initialOrders={initialOrders} onSubmit={fetchRouteData} />
                    <SaveRoute routeData={routeData} />
                </Box>
            </Box>

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

            {initialOrders.length > 0 && (
                <RouteSplit orders={initialOrders} fixedStartAddress="Reisenberg" />
            )}
            <RouteDialog open={openDialog} stop={selectedStop} onClose={handleCloseDialog} onSave={handleDialogSave} />
        </Box>
    );
};

export default RoutesPage;