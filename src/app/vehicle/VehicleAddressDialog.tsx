import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Snackbar, Alert, Box, Typography } from "@mui/material";
import AddressList from "../routes/AddressList.tsx";
import { API_BASE_URL } from "../../../apiConfig";
import { Stop } from "../../domain/Stop";
import DetailsDialog from "../routes/AddressDetails.tsx";
import BillingDialog from "../routes/BillingDialogue.tsx";

interface Props {
    open: boolean;
    onClose: () => void;
    routeId: number;
}

interface RouteData {
    routeData?: string;
    reserveStock?: { productId: number; quantity: number }[];
}

function AddressDialog({ open, onClose, routeId }: Props) {
    const [stops, setStops] = useState<any[]>([]);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' } | null>(null);
    const [loadingSave, setLoadingSave] = useState(false);
    const [showLoadList, setShowLoadList] = useState(false);
    const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [billingDialogOpen, setBillingDialogOpen] = useState(false);
    const [routeReserveStock, setRouteReserveStock] = useState<{ productId: number; quantity: number }[] | undefined>(undefined);

    useEffect(() => {
        const fetchRouteData = async () => {
            if (!routeId || routeId === 0) return;
            try {
                const response = await fetch(`${API_BASE_URL}/Route/${routeId}`);
                if (!response.ok) throw new Error(`Fehler: ${response.status}`);
                const route: RouteData = await response.json();
                if (route?.routeData) {
                    try {
                        const parsedData = JSON.parse(route.routeData);
                        setStops(parsedData.rawStops || []);
                    } catch (error) {
                        console.error("Fehler beim Parsen der Route:", error);
                        setStops([]);
                    }
                }
                setRouteReserveStock(route.reserveStock);
            } catch (error) {
                console.error("Fehler beim Abrufen der Route:", error);
                setStops([]);
                setRouteReserveStock(undefined);
            }
        };
        if (open && routeId && routeId !== 0) {
            fetchRouteData();
        }
    }, [open, routeId]);

    const handleCloseSnackbar = () => {
        setSnackbar(null);
    };

    const handleSaveTotalQuantities = async (routeId: number, updatedQuantities: { productId: number; quantity: number }[]) => {
        setLoadingSave(true);
        try {
            console.log("Daten, die an den Backend gesendet werden:", updatedQuantities);  // Hinzugefügtes Logging
            const response = await fetch(`${API_BASE_URL}/Route/${routeId}/reserve-stock`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedQuantities),
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.log("Fehler vom Server:", errorData); // Hinzugefügtes Logging
                throw new Error(`Fehler beim Speichern der Reservemengen: ${response.status} - ${errorData?.message || 'Unbekannter Fehler'}`);
            }
            setSnackbar({ open: true, message: 'Reservemengen erfolgreich gespeichert!', severity: 'success' });
            const updatedRouteResponse: RouteData = await response.json();
            setRouteReserveStock(updatedRouteResponse.reserveStock);
            console.log("Antwort vom Server:", updatedRouteResponse); // Hinzugefügtes Logging

        } catch (error: any) {
            console.error("Fehler beim Speichern der Reservemengen:", error);
            setSnackbar({ open: true, message: error.message, severity: 'error' });
        } finally {
            setLoadingSave(false);
        }
    };

    const toggleLoadListVisibility = () => {
        setShowLoadList(!showLoadList);
    };

    const handleOpenDetailsDialog = (stop: Stop) => {
        setSelectedStop(stop);
        setDetailsDialogOpen(true);
    };

    const handleCloseDetailsDialog = () => {
        setDetailsDialogOpen(false);
        setSelectedStop(null);
    };

    const handleOpenBillingDialog = (stop: Stop) => {
        setSelectedStop(stop);
        setBillingDialogOpen(true);
    };

    const handleCloseBillingDialog = () => {
        setBillingDialogOpen(false);
        setSelectedStop(null);
    };

    if (!routeId || routeId === 0) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 1 }}>
                {routeId && routeId !== 0 ? `Details für Route ${routeId}` : "Details"}
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button onClick={() => setShowLoadList(false)} color={!showLoadList ? 'primary' : 'secondary'} size="small">
                        Stopps
                    </Button>
                    <Button onClick={toggleLoadListVisibility} color={showLoadList ? 'primary' : 'secondary'} size="small">
                        Ladeliste
                    </Button>
                </Box>
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
                            <AddressList
                                stops={stops}
                                handleStatusChange={() => {}}
                                handleExportToGoogleMaps={() => {}}
                                onSaveTotalQuantities={handleSaveTotalQuantities}
                                routeId={routeId}
                                showLoadList={showLoadList}
                                onOpenDetailsDialog={handleOpenDetailsDialog}
                                onOpenBillingDialog={handleOpenBillingDialog}
                                routeReserveStock={routeReserveStock}
                            />
                        ) : (
                            <p>Keine Adressen verfügbar</p>
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ paddingTop: 1, paddingBottom: 1 }}>
                <Button onClick={onClose} color="primary" disabled={loadingSave} size="small">Schließen</Button>
                {loadingSave && <Typography sx={{ ml: 2 }}>Speichere...</Typography>}
            </DialogActions>
            <Snackbar
                open={snackbar?.open || false}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar?.severity || 'info'} variant="filled" sx={{ width: '100%' }}>
                    {snackbar?.message}
                </Alert>
            </Snackbar>
            {selectedStop && (
                <DetailsDialog open={detailsDialogOpen} handleClose={handleCloseDetailsDialog} stop={selectedStop} />
            )}
            {selectedStop && (
                <BillingDialog open={billingDialogOpen} handleClose={handleCloseBillingDialog} stop={selectedStop} />
            )}
        </Dialog>
    );
}

export default AddressDialog;

