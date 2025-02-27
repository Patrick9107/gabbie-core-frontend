import React, { useState } from "react";
import AddressInput from "./AddressInput";
import MapComponent from "./Map";
import { API_BASE_URL } from "../../../apiConfig.ts";
import {Box, Button, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";

interface Stop {
    name: string;
    arrival: number;  
    distance: number; 
    status: string;
}

interface RouteState {
    origin: string;
    destination: string;
    waypoints: { location: string; stopover: boolean }[];
    rawStops: Stop[];
}

const RoutesPage: React.FC = () => {
    const [routeData, setRouteData] = useState<RouteState | null>(null);

    const handleExportToGoogleMaps = (address: string) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        window.open(url, "_blank");
    };

    const handleStatusChange = (index: number, newStatus: string) => {
        if (!routeData) return;

        const updatedStops = [...routeData.rawStops];
        updatedStops[index].status = newStatus;

        setRouteData({ ...routeData, rawStops: updatedStops });
    };

    const handleGetRoute = async (addresses: string[]) => {
        try {
            const requestBody = {
                locations: addresses.map(address => ({ address /*nicht sicher warum hier die service time nicht funktioniert*/})),
            };
            
            console.log(requestBody);
            
            const response = await fetch(`${API_BASE_URL}/Tour/createRouteWithAddress`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) throw new Error("Failed to fetch route");

            const routeData = await response.json();
            console.log("RouteXL Response:", routeData);

            const orderedAddresses = Object.values(routeData.route).map((stop: any) => stop.name);
            
            const rawStops = orderedAddresses.slice(1).map((address, index) => {
                const stop = routeData.route[index + 1]; // +1 damir Reisenberg nicht da ist
                return {
                    name: address,
                    arrival: stop?.arrival || 'N/A', 
                    distance: stop?.distance || 'N/A', 
                    status: 'pending',
                };
            });

            const origin = orderedAddresses[0];
            const destination = orderedAddresses[orderedAddresses.length - 1];
            const waypoints = orderedAddresses.slice(1, -1).map(address => ({ location: address, stopover: true }));

            setRouteData({
                origin,
                destination,
                waypoints,
                rawStops, 
            });
        } catch (error) {
            console.error("Error fetching route:", error);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", p: 2 }}>
            <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                Routenplanung
            </Typography>

            {/* Map */}
            <Box sx={{ display: "flex", height: "70vh" }}>
                <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {routeData && <MapComponent routeData={routeData} />}
                </Box>
                <Box sx={{ width: 300, p: 2, border: "1px solid #ddd", borderRadius: "8px" }}>
                    <AddressInput onSubmit={handleGetRoute} />
                </Box>
            </Box>

            {/* Liste */}
            {routeData?.rawStops && (
                <Box sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Stopps auf der Route
                    </Typography>
                    {routeData.rawStops.map((stop, index) => (
                        <Box
                            key={index}
                            sx={{
                                p: 2,
                                mb: 1,
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                backgroundColor: "#ffffff",
                                boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Box>
                                <Typography variant="h6">{stop.name}</Typography>
                                {/*Service Time provisorisch hier*/}
                                <Typography variant="body2">Ankunft: {stop.arrival + 8} min </Typography>
                                <Typography variant="body2">Distanz: {stop.distance} km</Typography>
                            </Box>
                            <FormControl size="small" sx={{ minWidth: 150, mr: 2 }}>
                                <InputLabel id={`status-label-${index}`}>Route Status</InputLabel>
                                <Select
                                    label='RouteStatus'
                                    value={stop.status}
                                    onChange={(e) => handleStatusChange(index, e.target.value)}
                                >
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="delivered">Delivered</MenuItem>
                                    <MenuItem value="canceled">Canceled</MenuItem>
                                    <MenuItem value="moved">Moved</MenuItem>
                                    <MenuItem value="notReachable">Not Reachable</MenuItem>
                                </Select>
                            </FormControl>
                            {/* 
                                In dieser Box fehlt noch...
                                    - PopUp für Produkte
                                    - PopUp für Kundendaten
                                    - PopUp für eine Notiz
                            */}
                            <Button
                                variant="contained"
                                color="success"
                                size="medium"
                                onClick={() => handleExportToGoogleMaps(stop.name)}
                            >
                                Google Maps
                            </Button>
                        </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
};



export default RoutesPage;