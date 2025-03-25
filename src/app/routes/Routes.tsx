import React, {useState} from "react";
import AddressInput from "./AddressInput";
import MapComponent from "./Map";
import RouteDialog from "./RouteDialog";
import SaveRoute from "./SaveRoute";
import {Box, Typography} from "@mui/material";
import {Order} from "../../domain/Order.ts";
import {Stop} from "../../domain/Stop.ts"
import {useLocation} from "react-router-dom";
import AddressList from "./AddressList";
import { handleGetRoute } from "./RouteUtils.tsx";

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
    const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
    
    console.log("RouteData: " + routeData);
    
    const location = useLocation();
    const initialOrders: Order[] = location.state?.orders || [];

    const handleExportToGoogleMaps = (address: string) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        window.open(url, "_blank");
    };

    const handleOpenDialog = (stop: Stop) => {
        setSelectedStop(stop);
        setOpenDialog(true);
    };

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

    const handleStatusChange = (index: number, newStatus: string) => {
        if (!routeData) return;

        const updatedStops = [...routeData.rawStops];
        updatedStops[index].status = newStatus;

        setRouteData({ ...routeData, rawStops: updatedStops });
    };

    const fetchRouteData = async (orders: Order[]) => {
        try {
            const result = await handleGetRoute(orders);
            setRouteData(result);
        } catch (error) {
            console.error("Fehler beim Abrufen der Route:", error);
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
            <AddressList
                stops={routeData?.rawStops}
                handleStatusChange={handleStatusChange}
                handleOpenDialog={handleOpenDialog}
                handleExportToGoogleMaps={handleExportToGoogleMaps}
            />
            <RouteDialog open={openDialog} stop={selectedStop} onClose={handleCloseDialog} onSave={handleDialogSave} />
        </Box>
    );
};

export default RoutesPage;
