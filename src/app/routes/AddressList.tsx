import React, { useState, useEffect } from "react";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Button } from "@mui/material";
import { Stop } from "../../domain/Stop.ts";
import DetailsDialog from "./AddressDetails.tsx";
import BillingDialog from "./BillingDialogue.tsx";

interface AddressListProps {
    stops: Stop[] | undefined;
    handleStatusChange: (index: number, status: string) => void;
    handleExportToGoogleMaps: (address: string) => void;
}

const AddressList: React.FC<AddressListProps> = ({ stops, handleStatusChange, handleExportToGoogleMaps }) => {
    const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [billingDialogOpen, setBillingDialogOpen] = useState(false);
    const [orderSummary, setOrderSummary] = useState<any[]>([]);

    useEffect(() => {
        if (!stops) return;

        const summary: any[] = [];
        stops.forEach((stop) => {
            if (stop?.order?.orderItems) {
                stop.order.orderItems.forEach((item: any) => {
                    const existingItem = summary.find((s: any) => s.productId === item.product.id);
                    if (existingItem) {
                        existingItem.quantity += item.quantity;
                    } else {
                        summary.push({
                            productId: item.product.id,
                            name: item.product.name,
                            quantity: item.quantity,
                            price: item.product.price,
                        });
                    }
                });
            }
        });
        setOrderSummary(summary);
    }, [stops]);

    if (!stops || stops.length === 0) return <p></p>;

    const handleOpenDialog = (stop: Stop) => {
        setSelectedStop(stop);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    const handleOpenBillingDialog = (stop: Stop) => {
        setSelectedStop(stop);
        setBillingDialogOpen(true);
    };

    const handleCloseBillingDialog = () => {
        setBillingDialogOpen(false);
    };

    return (
        <>
            <Box sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Stopps auf der Route
                </Typography>
                {stops.map((stop, index) => (
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
                            gap: 2,
                            minHeight: "80px",
                        }}
                    >
                        <Box sx={{ flex: 2, minWidth: "200px", maxWidth: "350px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            <Typography variant="h6">{stop.order.address}</Typography>
                            <Typography variant="body2">Ankunft: {stop.arrival} min</Typography>
                            <Typography variant="body2">Distanz: {stop.distance} km</Typography>
                        </Box>

                        <FormControl size="small" sx={{ minWidth: 100, flex: 1 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
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

                        <Box sx={{ display: "flex", gap: 1, flex: 2, justifyContent: "flex-end" }}>
                            <Button variant="contained" color="success" onClick={() => handleOpenDialog(stop)}>
                                Details
                            </Button>
                            <Button variant="contained" color="success" onClick={() => handleOpenBillingDialog(stop)}>
                                Rechnung
                            </Button>
                            <Button variant="contained" color="success" onClick={() => handleExportToGoogleMaps(stop.order.address)}>
                                Google Maps
                            </Button>
                        </Box>
                    </Box>
                ))}
            </Box>
            
            <Box sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    Bestellübersicht
                </Typography>
                {orderSummary.length > 0 ? (
                    <ul>
                        {orderSummary.map((item, index) => (
                            <li key={index}>
                                {item.name} - {item.quantity} x {item.price}€ = {(item.quantity * item.price).toFixed(2)}€
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Keine Bestellungen verfügbar.</p>
                )}
            </Box>
            
            {selectedStop && (
                <DetailsDialog open={dialogOpen} handleClose={handleCloseDialog} stop={selectedStop} />
            )}
            
            {selectedStop && (
                <BillingDialog open={billingDialogOpen} handleClose={handleCloseBillingDialog} stop={selectedStop} />
            )}
        </>
    );
};

export default AddressList;
