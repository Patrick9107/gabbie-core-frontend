import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";
import MapComponent from "../routes/Map";
import AddressList from "../routes/AddressList";
import {
    Button,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    Grid,
    TextField,
    Avatar,
    CircularProgress,
    Alert
} from "@mui/material";

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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [billingDialogOpen, setBillingDialogOpen] = useState(false);

    const [localReserveQuantities, setLocalReserveQuantities] = useState<{ [productId: number]: number }>({});
    const [showLoadList, setShowLoadList] = useState<boolean>(false);

    const navigate = useNavigate();
    const { setIsTokenValid } = useAuth();

    useEffect(() => {
        const fetchVehicle = async () => {
            setIsLoading(true); // Start loading for vehicle fetch
            let storedVehicleName = localStorage.getItem("name");

            if (!storedVehicleName) {
                setError("No vehicle assigned to the logged-in user.");
                setIsLoading(false);
                return;
            }

            if (storedVehicleName.startsWith("Fahrzeug-")) {
                storedVehicleName = storedVehicleName.substring(9);
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/vehicle`);
                if (response.status === 200) {
                    const foundVehicle = response.data.find((v: any) => v.licensePlate === storedVehicleName);
                    if (foundVehicle) {
                        setVehicle(foundVehicle);
                    } else {
                        setError("Vehicle not found.");
                    }
                } else {
                    setError("Failed to fetch vehicles.");
                }
            } catch (error) {
                console.error("Error fetching vehicle data:", error);
                setError("Error fetching vehicle data.");
            } finally {
                // Do not set isLoading to false here, as routeData fetch depends on vehicle
                // and will manage its own loading state.
            }
        };

        fetchVehicle();
    }, []);

    useEffect(() => {
        const fetchRouteDataForVehicle = async () => {
            // Only set loading true if vehicle and routeId exist, otherwise keep as is (from vehicle fetch)
            if (vehicle && vehicle.routeId) {
                setIsLoading(true);
            }
            setError(null);

            if (!vehicle || !vehicle.routeId) {
                setIsLoading(false); // Stop loading if no vehicle or no routeId
                setRouteData(null);
                return;
            }

            try {
                const routeResponse = await axios.get(`${API_BASE_URL}/route/${vehicle.routeId}`);
                if (routeResponse.status === 200) {
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

                } else {
                    setError("Failed to fetch route data.");
                }
            } catch (error) {
                console.error("Error fetching route data:", error);
                setError("Error fetching route data.");
            } finally {
                setIsLoading(false); // Stop loading after route data fetch attempt
            }
        };

        if (vehicle) { // Only fetch route data if vehicle is loaded
            fetchRouteDataForVehicle();
        }
    }, [vehicle]);


    const handleReserveQuantityChange = (productId: number, value: string) => {
        const quantity = Math.max(0, parseInt(value, 10) || 0);
        setLocalReserveQuantities(prev => ({
            ...prev,
            [productId]: quantity
        }));
    };

    const handleStatusChange = async (index: number, status: string) => {
        if (!routeData?.rawStops) return;

        const updatedStops = [...routeData.rawStops];
        const stop = updatedStops[index];

        if (!stop || !stop.order?.id) {
            console.warn("No order found or order ID missing for this stop:", stop);
            return;
        }

        const originalStatus = stop.status;
        stop.status = status;
        setRouteData({ ...routeData, rawStops: updatedStops });

        try {
            await axios.patch(`${API_BASE_URL}/order/${stop.order.id}`, { status });
            console.log(`Order ${stop.order.id} status updated to ${status}`);
        } catch (error) {
            console.error("Failed to update order status:", error);
            setError("Error updating order status.");
            stop.status = originalStatus;
            setRouteData({ ...routeData, rawStops: updatedStops });
        }
    };

    const handleCompleteRoute = async () => {
        if (!vehicle?.id || !vehicle?.routeId) {
            setError("Fahrzeug- oder Routen-ID ist für den Abschluss nicht verfügbar.");
            return;
        }

        const confirmComplete = window.confirm(
            "Sind Sie sicher, dass Sie die Route abschließen möchten? Alle abgeschlossenen Bestellungen werden gelöscht, und das Fahrzeug wird freigegeben."
        );

        if (!confirmComplete) return;

        setIsLoading(true);
        setError(null);

        try {
            if (routeData?.rawStops) {
                for (const stop of routeData.rawStops) {
                    if (stop.status === "completed") {
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

            setVehicle((prev: any) => (prev ? { ...prev, routeId: 0 } : null));
            setRouteData(null);
            setLocalReserveQuantities({});

            alert("Route erfolgreich abgeschlossen! Fahrzeug freigegeben. Ausstehende Bestellungen bleiben im System.");

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
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            {/* Map at the top */}
            {routeData && routeData.rawStops && (
                <Box sx={{ mb: 3 }}>
                    <MapComponent routeData={routeData} />
                </Box>
            )}

            {/* Stops and Reserve Stock side-by-side using Grid */}
            <Grid container spacing={3}>
                {/* AddressList (Stops) on the left */}
                <Grid item xs={12} md={8}>
                    {routeData && routeData.rawStops && (
                        <AddressList
                            stops={routeData.rawStops}
                            handleStatusChange={handleStatusChange}
                            handleExportToGoogleMaps={(address: string) => {
                                const encodedAddress = encodeURIComponent(address);
                                const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`; // This still seems incorrect for Google Maps actual URL
                                window.open(url, "_blank");
                            }}
                            onOpenDetailsDialog={handleOpenDetailsDialog}
                            onOpenBillingDialog={handleOpenBillingDialog}
                            showLoadList={showLoadList}
                        />
                    )}
                </Grid>

                {/* Reserve Stock on the right */}
                <Grid item xs={12} md={4}>
                    {routeData && routeData.reserveStock && routeData.reserveStock.length > 0 && (
                        <Box sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '8px',
                            p: 2,
                            bgcolor: 'background.paper',
                            height: '100%',
                            overflowY: 'auto'
                        }}>
                            <Typography variant="h6" component="h2" gutterBottom>
                                Reserve Stock
                            </Typography>
                            <List dense>
                                {routeData.reserveStock.map((item: OrderItem, index: number) => (
                                    <ListItem
                                        key={item.product.id || index}
                                        disableGutters
                                        sx={{ py: 0.5, display: 'flex', alignItems: 'center' }}
                                    >
                                        {/* Product Image */}
                                        <Avatar
                                            variant="rounded"
                                            src={item.product.imageUrl || ''}
                                            alt={item.product.name}
                                            sx={{ width: 40, height: 40, mr: 1.5, flexShrink: 0 }}
                                        >
                                            {item.product.name ? item.product.name[0].toUpperCase() : 'P'}
                                        </Avatar>

                                        <ListItemText
                                            primary={
                                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                                    {item.product.name}
                                                </Typography>
                                            }
                                            secondary={`Product ID: ${item.product.id}`}
                                            sx={{ mr: 1 }}
                                        />
                                        <TextField
                                            type="number"
                                            value={localReserveQuantities[item.product.id] !== undefined ? localReserveQuantities[item.product.id] : 0}
                                            onChange={(e) => handleReserveQuantityChange(item.product.id, e.target.value)}
                                            inputProps={{ min: 0 }}
                                            size="small"
                                            sx={{ width: '80px', flexShrink: 0 }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                </Grid>
            </Grid>

            {/* Complete Route Button at the very end */}
            {vehicle?.routeId && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{
                            fontSize: "1rem",
                            width: "100%",
                            maxWidth: "300px",
                            padding: "14px",
                        }}
                        onClick={handleCompleteRoute}
                        disabled={isLoading}
                    >
                        Route Abschließen
                    </Button>
                </Box>
            )}
            {!vehicle?.routeId && !isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Typography variant="h6" color="text.secondary">
                        Keine Route zugewiesen.
                    </Typography>
                </Box>
            )}


            {/* **RENDER THE DIALOGS HERE** */}
            {selectedStop && (
                <DetailsDialog open={detailsDialogOpen} handleClose={handleCloseDetailsDialog} stop={selectedStop} />
            )}
            {selectedStop && (
                <BillingDialog open={billingDialogOpen} handleClose={handleCloseBillingDialog} stop={selectedStop} />
            )}
        </Box>
    );
};

export default React.memo(DriverPage);