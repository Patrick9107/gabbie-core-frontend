import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Card,
    CardContent,
    IconButton,
    Badge,
    List,
    TextField,
    Button,
    ListItem
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import { Stop } from "../../domain/Stop.ts";

interface AddressListProps {
    stops: Stop[] | undefined;
    handleStatusChange: (index: number, status: string) => void;
    handleExportToGoogleMaps: (address: string) => void;
    onSaveTotalQuantities: (routeId: number, updatedQuantities: { productId: number; quantity: number }[]) => void;
    routeId: number;
    showLoadList: boolean;
    onOpenDetailsDialog: (stop: Stop) => void;
    onOpenBillingDialog: (stop: Stop) => void;
    routeReserveStock: { productId: number; quantity: number }[] | undefined; // Neuer Prop für die initiale Reserve
}

interface TotalProduct {
    productId: number;
    name: string;
    requiredQuantity: number;
    reserveQuantity: number;
}

const AddressList: React.FC<AddressListProps> = ({
                                                     stops,
                                                     handleExportToGoogleMaps,
                                                     onSaveTotalQuantities,
                                                     routeId,
                                                     showLoadList,
                                                     onOpenDetailsDialog,
                                                     onOpenBillingDialog,
                                                     routeReserveStock
                                                 }) => {
    const [reserveQuantities, setReserveQuantities] = useState<{ [productId: number]: number }>({});

    useEffect(() => {
        if (!stops) return;

        // Initialisiere die Reserve mit den Werten vom Backend, falls vorhanden
        if (routeReserveStock) {
            const initialReserveFromBackend: { [productId: number]: number } = {};
            routeReserveStock.forEach(item => {
                initialReserveFromBackend[item.productId] = item.quantity;
            });
            setReserveQuantities(initialReserveFromBackend);
        } else {
            setReserveQuantities({});
        }
    }, [stops, routeReserveStock]);

    const handleIncrementReserve = (productId: number) => {
        setReserveQuantities(prev => ({
            ...prev,
            [productId]: (prev[productId] || 0) + 1,
        }));
    };

    const handleDecrementReserve = (productId: number) => {
        setReserveQuantities(prev => ({
            ...prev,
            [productId]: Math.max(0, (prev[productId] || 0) - 1),
        }));
    };

    const handleReserveChange = (productId: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        console.log(`handleReserveChange: productId=<span class="math-inline">\{productId\}, value\=</span>{value}`);
        setReserveQuantities(prev => {
            const newState = {
                ...prev,
                [productId]: isNaN(value) ? 0 : value,
            };
            console.log("New State:", newState);
            return newState;
        });
    };

    const handleSaveTotalQuantities = () => {
        const updatedQuantities: { productId: number; quantity: number }[] = [];
        for (const productId in reserveQuantities) {
            if (Object.hasOwnProperty.call(reserveQuantities, productId)) {
                const parsedProductId = parseInt(productId);
                if (!isNaN(parsedProductId)) {
                    updatedQuantities.push({
                        productId: parsedProductId,
                        quantity: reserveQuantities[productId] || 0,
                    });
                }
            }
        }
        onSaveTotalQuantities(routeId, updatedQuantities);
    };

    const getTotalProductsList = (): TotalProduct[] => {
        const uniqueProducts: { [productId: number]: TotalProduct } = {};
        
        stops?.slice(1).forEach(stop => {
            stop.order?.orderItems?.forEach((item: any) => {
                const productId = item.product.id;
                // das ist intended keine Sorge
                // @ts-ignore
                const reserveQuantity = routeReserveStock?.find(r => r.product.id === productId)?.quantity;
                if (uniqueProducts[productId]) {
                    uniqueProducts[productId].requiredQuantity += item.quantity;
                    uniqueProducts[productId].reserveQuantity = reserveQuantity !== undefined ? reserveQuantity : 0; // Update reserveQuantity
                } else {
                    uniqueProducts[productId] = {
                        productId: productId,
                        name: item.product.name || 'Unbekanntes Produkt',
                        requiredQuantity: item.quantity,
                        reserveQuantity: reserveQuantity !== undefined ? reserveQuantity : 0, // Use the value from routeReserveStock
                    };
                }
            });
        });

        return Object.values(uniqueProducts);
    };

    return (
        <>
            {!showLoadList && (
                <Paper sx={{ mt: 3, p: 2, borderRadius: "8px", elevation: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Stopps auf der Route
                    </Typography>
                    {stops?.slice(1).map((stop, index) => (
                        <Card key={index} sx={{ mb: 2, borderRadius: "8px", boxShadow: 1 }}>
                            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
                                    <Badge
                                        badgeContent={stop?.status}
                                        color={
                                            stop?.status === "delivered" ? "success" :
                                                stop?.status === "canceled" ? "error" :
                                                    stop?.status === "moved" ? "warning" :
                                                        stop?.status === "notReachable" ? "error" :
                                                            "info"
                                        }
                                        sx={{ mr: 2 }}
                                    />
                                    <Typography variant="h6" sx={{ flexGrow: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                        {stop?.order?.address}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton color="primary" onClick={() => handleExportToGoogleMaps(stop?.order?.address || "")} size="small">
                                        <LocationOnOutlinedIcon />
                                    </IconButton>
                                    <IconButton color="primary" onClick={() => onOpenDetailsDialog(stop as Stop)} size="small">
                                        <InfoOutlinedIcon />
                                    </IconButton>
                                    <IconButton color="primary" onClick={() => onOpenBillingDialog(stop as Stop)} size="small">
                                        <ReceiptOutlinedIcon />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Paper>
            )}

            {showLoadList && (
                <Paper sx={{ mt: 3, p: 2, borderRadius: "8px", elevation: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Ladeliste bearbeiten (Gesamt mit Reserve)
                    </Typography>
                    <List>
                        {getTotalProductsList().map((product) => (
                            <ListItem key={product.productId} sx={{ py: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography sx={{ width: '40%' }}>{product.name}</Typography>
                                <Typography sx={{ width: '20%', textAlign: 'center', color: 'textSecondary' }}>
                                    Benötigt: {product.requiredQuantity}
                                </Typography>
                                <Typography sx={{ width: '20%', textAlign: 'center', color: 'textSecondary' }}>
                                    Reserve: {product.reserveQuantity}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '40%', justifyContent: 'flex-end' }}>
                                    <IconButton size="small" onClick={() => handleDecrementReserve(product.productId)}>
                                        <RemoveIcon fontSize="small" />
                                    </IconButton>
                                    <TextField
                                        type="number"
                                        size="small"
                                        value={reserveQuantities[product.productId] || 0}
                                        onChange={(e) => handleReserveChange(product.productId, e as React.ChangeEvent<HTMLInputElement>)}
                                        inputProps={{ min: 0 }}
                                        sx={{ width: 60, mx: 1, textAlign: 'center' }}
                                    />
                                    <IconButton size="small" onClick={() => handleIncrementReserve(product.productId)}>
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                    <Typography sx={{ ml: 1 }}>Reserve</Typography>
                                </Box>
                            </ListItem>
                        ))}
                        {getTotalProductsList().length === 0 && (
                            <Typography>Keine Produkte in dieser Route.</Typography>
                        )}
                    </List>
                    <Button variant="contained" color="primary" onClick={handleSaveTotalQuantities} sx={{ mt: 2 }}>
                        Reservemengen speichern
                    </Button>
                </Paper>
            )}
        </>
    );
};

export default AddressList;

