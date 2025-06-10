import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";
import MapComponent from "../routes/Map";
import AddressList from "../routes/AddressList";
import {
    Button,
    Box,
    Typography,
    Grid,
    CircularProgress,
    Alert,
    List,
    ListItem,
    Avatar,
    ListItemText,
    TextField
} from "@mui/material";
// --- HINZUGEFÜGT: Imports für die wiederhergestellte Funktionalität ---
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../login/AuthProvider.tsx';
import { logout } from '../../infra/api/authService.ts';

import DetailsDialog from "../routes/AddressDetails.tsx";
import BillingDialog from "../routes/BillingDialogue.tsx";
import { Stop } from "../../domain/Stop";
import { OrderItem, RouteData, deserializeRouteData } from "./DriverUtils";

const DriverPage = () => {
    const [vehicle, setVehicle] = useState<any | null>(null);
    const [routeData, setRouteData] = useState<RouteData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [billingDialogOpen, setBillingDialogOpen] = useState(false);

    const [localReserveQuantities, setLocalReserveQuantities] = useState<{ [productId: number]: number }>({});
    const [refetchTrigger, setRefetchTrigger] = useState<number>(0);
    const isInitialMount = useRef(true);

    // --- HINZUGEFÜGT: Hooks für die wiederhergestellte Funktionalität ---
    const navigate = useNavigate();
    const { setIsTokenValid } = useAuth();

    useEffect(() => {
        const fetchAllData = async () => {
            if (isInitialMount.current) {
                setIsLoading(true);
            }
            setError(null);

            let foundVehicle: any = null;
            try {
                let storedVehicleName = localStorage.getItem("name");
                if (!storedVehicleName) throw new Error("Kein Fahrzeug zugewiesen. Bitte neu einloggen.");

                if (storedVehicleName.startsWith("Fahrzeug-")) {
                    storedVehicleName = storedVehicleName.substring(9);
                }

                const vehicleResponse = await axios.get(`${API_BASE_URL}/vehicle`);
                foundVehicle = vehicleResponse.data.find((v: any) => v.licensePlate === storedVehicleName);

                if (foundVehicle) {
                    setVehicle(foundVehicle);
                } else {
                    throw new Error("Das zugewiesene Fahrzeug wurde nicht gefunden.");
                }
            } catch (err: any) {
                setError(err.message || "Fehler beim Laden des Fahrzeugs.");
                if (isInitialMount.current) setIsLoading(false);
                return;
            }

            if (foundVehicle && foundVehicle.routeId) {
                try {
                    const routeResponse = await axios.get(`${API_BASE_URL}/route/${foundVehicle.routeId}`);
                    const apiResponseData = routeResponse.data;
                    const deserializedRouteData = deserializeRouteData(apiResponseData.routeData);

                    const fetchedRouteData: RouteData = {
                        ...deserializedRouteData,
                        reserveStock: apiResponseData.reserveStock || []
                    };
                    setRouteData(fetchedRouteData);

                    const initialQuantities: { [productId: number]: number } = {};
                    fetchedRouteData.reserveStock.forEach(item => {
                        initialQuantities[item.product.id] = item.quantity;
                    });
                    setLocalReserveQuantities(initialQuantities);

                } catch (err: any) {
                    setError(err.message || "Fehler beim Laden der Routendaten.");
                }
            } else {
                setRouteData(null);
            }

            if (isInitialMount.current) {
                setIsLoading(false);
                isInitialMount.current = false;
            }
        };

        fetchAllData();
    }, [refetchTrigger]);


    const handleStatusChange = async (index: number, status: string) => {
        if (!routeData?.rawStops) return;
        const updatedStops = [...routeData.rawStops];
        const stop = updatedStops[index];
        if (!stop || !stop.order?.id) return;

        const originalStatus = stop.status;
        stop.status = status;
        setRouteData({ ...routeData, rawStops: updatedStops });

        try {
            await axios.patch(`${API_BASE_URL}/order/${stop.order.id}`, { status });
            console.log(`Order ${stop.order.id} Status aktualisiert. Stiller Refetch wird ausgelöst.`);
            setRefetchTrigger(c => c + 1);
        } catch (error) {
            console.error("Fehler beim Aktualisieren des Bestellstatus:", error);
            setError("Fehler beim Aktualisieren des Bestellstatus.");
            stop.status = originalStatus;
            setRouteData({ ...routeData, rawStops: updatedStops });
        }
    };

    const handleReserveQuantityChange = (productId: number, value: string) => {
        const quantity = Math.max(0, parseInt(value, 10) || 0);
        setLocalReserveQuantities(prev => ({ ...prev, [productId]: quantity }));
    };

    // --- HINZUGEFÜGT: Die vollständige handleCompleteRoute-Funktion ---
    const handleCompleteRoute = async () => {
        if (!vehicle?.id || !vehicle?.routeId) {
            setError("Fahrzeug- oder Routen-ID ist für den Abschluss nicht verfügbar.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (routeData?.rawStops) {
                const finishedStatuses = ['completed', 'delivered']; // Berücksichtigt beide End-Status
                for (const stop of routeData.rawStops) {
                    if (stop.status && finishedStatuses.includes(stop.status.toLowerCase())) {
                        const orderId = stop.order?.id;
                        if (orderId) {
                            await axios.delete(`${API_BASE_URL}/order/${orderId}`);
                            console.log(`Deleted completed order with ID: ${orderId}`);
                        } else {
                            console.warn("Skipping completed stop - no orderId found:", stop);
                        }
                    } else {
                        console.log(`Skipping non-completed order with ID ${stop.order?.id} - Status: ${stop.status}`);
                    }
                }
            }
            console.log("Deletion of completed orders attempted.");

            const updatedVehicleData = { ...vehicle, routeId: 0 };
            await axios.put(`${API_BASE_URL}/vehicle/${vehicle.id}`, updatedVehicleData);

            // Lokalen State zurücksetzen
            setVehicle(prev => (prev ? { ...prev, routeId: 0 } : null));
            setRouteData(null);
            setLocalReserveQuantities({});
            

            // Logout-Prozess
            await logout();
            setIsTokenValid(false);
            localStorage.removeItem('authToken');
            localStorage.removeItem('role');
            localStorage.removeItem('name');
            navigate('/login');

        } catch (error) {
            setError("Fehler beim Abschließen der Route. Bitte überprüfen Sie die Konsole.");
            console.error("Error completing route (deleting orders or updating vehicle):", error);
        } finally {
            setIsLoading(false);
        }
    };


    const handleOpenDetailsDialog = (stop: Stop) => { setSelectedStop(stop); setDetailsDialogOpen(true); };
    const handleCloseDetailsDialog = () => { setDetailsDialogOpen(false); setSelectedStop(null); };
    const handleOpenBillingDialog = (stop: Stop) => { setSelectedStop(stop); setBillingDialogOpen(true); };
    const handleCloseBillingDialog = () => { setBillingDialogOpen(false); setSelectedStop(null); };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {vehicle?.licensePlate ? `Fahrzeug-${vehicle.licensePlate}` : "Lieferanten Ansicht"}
            </Typography>

            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <CircularProgress />
                </Box>
            )}

            {error && !isLoading && (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}

            {!isLoading && !error && (
                <>
                    {routeData ? (
                        <>
                            {routeData.rawStops && (
                                <Box sx={{ mb: 3 }}>
                                    <MapComponent routeData={routeData} />
                                </Box>
                            )}
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={8}>
                                    {routeData.rawStops && (
                                        <AddressList
                                            stops={routeData.rawStops}
                                            handleStatusChange={handleStatusChange}
                                            onOpenDetailsDialog={handleOpenDetailsDialog}
                                            onOpenBillingDialog={handleOpenBillingDialog}
                                            showLoadList={false}
                                        />
                                    )}
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    {routeData.reserveStock && routeData.reserveStock.length > 0 && (
                                        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '8px', p: 2, bgcolor: 'background.paper', height: '100%', overflowY: 'auto' }}>
                                            <Typography variant="h6" component="h2" gutterBottom>Reserve Stock</Typography>
                                            <List dense>
                                                {routeData.reserveStock.map((item: OrderItem) => (
                                                    <ListItem key={item.product.id} disableGutters sx={{ py: 0.5, display: 'flex', alignItems: 'center' }}>
                                                        <Avatar variant="rounded" src={item.product.imageUrl || ''} alt={item.product.name} sx={{ width: 40, height: 40, mr: 1.5, flexShrink: 0 }}>
                                                            {item.product.name ? item.product.name[0].toUpperCase() : 'P'}
                                                        </Avatar>
                                                        <ListItemText primary={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.product.name}</Typography>} secondary={`Product ID: ${item.product.id}`} sx={{ mr: 1 }} />
                                                        <TextField type="number" value={localReserveQuantities[item.product.id] !== undefined ? localReserveQuantities[item.product.id] : 0} onChange={(e) => handleReserveQuantityChange(item.product.id, e.target.value)} inputProps={{ min: 0 }} size="small" sx={{ width: '80px', flexShrink: 0 }} />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </Box>
                                    )}
                                </Grid>
                            </Grid>

                            {/* --- HINZUGEFÜGT: Button zum Abschließen der Route --- */}
                            {vehicle?.routeId && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                    <Button variant="contained" color="success" sx={{ fontSize: "1rem", width: "100%", maxWidth: "300px", padding: "14px" }} onClick={handleCompleteRoute} disabled={isLoading}>
                                        Route Abschließen
                                    </Button>
                                </Box>
                            )}
                        </>
                    ) : (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Typography variant="h6" color="text.secondary">
                                {vehicle ? "Keine Route zugewiesen." : "Lade Fahrzeugdaten..."}
                            </Typography>
                        </Box>
                    )}
                </>
            )}

            {selectedStop && <DetailsDialog open={detailsDialogOpen} handleClose={handleCloseDetailsDialog} stop={selectedStop} />}
            {selectedStop && <BillingDialog open={billingDialogOpen} handleClose={handleCloseBillingDialog} stop={selectedStop} />}
        </Box>
    );
};

export default React.memo(DriverPage);