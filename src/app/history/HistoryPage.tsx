import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../apiConfig.ts";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import PastRouteAddressDialog from "./HistoryAddressDialog.tsx";

const HistoryPage: React.FC = () => {
    const [routes, setRoutes] = useState<any[]>([]);
    const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/Route`);
                const data = await response.json();
                console.log("Fetched Routes:", data);
                
                const sortedRoutes = data.sort((a: any, b: any) => b.id - a.id);
                setRoutes(sortedRoutes);
            } catch (error) {
                console.error("Error fetching routes:", error);
            }
        };

        fetchRoutes();
    }, []);
    
    const handleStopsClick = (routeId: number) => {
        setSelectedRouteId(routeId);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    return (
        <>
            <TableContainer component={Paper} sx={{ overflow: "hidden", borderRadius: "12px", boxShadow: 3, p: 2 }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: "#3d9970", "& th": { color: "white", fontWeight: "bold" } }}>
                            <TableCell>ID</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell>Distance (km)</TableCell>
                            <TableCell>Duration (min)</TableCell>
                            <TableCell>Addressen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {routes.length > 0 ? (
                            routes.map((route) => (
                                <TableRow key={route.id}>
                                    <TableCell>{route.id}</TableCell>
                                    <TableCell>{new Date(route.startTime).toLocaleString()}</TableCell>
                                    <TableCell>{new Date(route.endTime).toLocaleString()}</TableCell>
                                    <TableCell>{route.totalDistance}</TableCell>
                                    <TableCell>{Math.round(route.totalDuration / 60)}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: "#3d9970" }}
                                            onClick={() => handleStopsClick(route.id)}
                                        >
                                            View Stops
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No routes found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {selectedRouteId && (
                <PastRouteAddressDialog
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    routeId={selectedRouteId}
                />
            )}
        </>
    );
};

export default HistoryPage;
