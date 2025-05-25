import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Paper,
    Card,
    CardContent,
    IconButton,
    List,
    TextField,
    Button,
    ListItem,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import { Stop } from "../../domain/Stop.ts";

export const DRIVER_ORDER_STATUSES = [
    { value: "pending", label: "Ausstehend" },
    { value: "in-progress", label: "In Bearbeitung" },
    { value: "completed", label: "Abgeschlossen" },
    { value: "failed", label: "Fehlgeschlagen" },
];

/*const LOCAL_STATUS_DISPLAY_MAP = {
    "pending": { label: "Ausstehend", color: "info" },
    "in-progress": { label: "In Bearbeitung", color: "warning" },
    "completed": { label: "Abgeschlossen", color: "success" },
    "failed": { label: "Fehlgeschlagen", color: "error" },
    "delivered": { label: "Geliefert", color: "success" },
    "canceled": { label: "Storniert", color: "error" },
    "notReachable": { label: "Nicht Erreichbar", color: "error" },
    "moved": { label: "Verschoben", color: "warning" },
};*/


interface AddressListProps {
    stops: Stop[] | undefined;
    handleStatusChange: (originalIndex: number, status: string) => void;
    handleExportToGoogleMaps: (address: string) => void;
    onSaveTotalQuantities?: (routeId: number, updatedQuantities: { productId: number; quantity: number }[]) => void;
    routeId?: number;
    showLoadList: boolean;
    onOpenDetailsDialog?: (stop: Stop) => void;
    onOpenBillingDialog?: (stop: Stop) => void;
    routeReserveStock?: { productId: number; quantity: number }[] | undefined;
    canChangeStatus?: boolean;
}

interface TotalProduct {
    productId: number;
    name: string;
    requiredQuantity: number;
    reserveQuantity: number;
}

const AddressList: React.FC<AddressListProps> = ({
                                                     stops,
                                                     handleStatusChange,
                                                     handleExportToGoogleMaps,
                                                     onSaveTotalQuantities,
                                                     routeId,
                                                     showLoadList,
                                                     onOpenDetailsDialog,
                                                     onOpenBillingDialog,
                                                     routeReserveStock,
                                                     canChangeStatus = true,
                                                 }) => {
    const [reserveQuantities, setReserveQuantities] = useState<{ [productId: number]: number }>({});

    useEffect(() => {
        if (!stops) {
            setReserveQuantities({});
            return;
        }

        if (routeReserveStock && routeReserveStock.length > 0) {
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
        setReserveQuantities(prev => {
            const newState = {
                ...prev,
                [productId]: isNaN(value) ? 0 : value,
            };
            return newState;
        });
    };

    const handleSaveTotalQuantitiesInternal = () => {
        if (!onSaveTotalQuantities || routeId === undefined) {
            console.warn("onSaveTotalQuantities oder routeId nicht bereitgestellt. Speichern nicht möglich.");
            return;
        }

        const updatedQuantities: { productId: number; quantity: number }[] = [];
        for (const productId in reserveQuantities) {
            if (Object.prototype.hasOwnProperty.call(reserveQuantities, productId)) {
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

        stops?.forEach(stop => {
            stop.order?.orderItems?.forEach((item: any) => {
                const productId = item.product.id;
                const requiredOrderItemQuantity = item.quantity;
                const currentReserveFromState = reserveQuantities[productId];

                if (uniqueProducts[productId]) {
                    uniqueProducts[productId].requiredQuantity += requiredOrderItemQuantity;
                    uniqueProducts[productId].reserveQuantity = currentReserveFromState !== undefined ? currentReserveFromState : 0;
                } else {
                    uniqueProducts[productId] = {
                        productId: productId,
                        name: item.product.name || 'Unbekanntes Produkt',
                        requiredQuantity: requiredOrderItemQuantity,
                        reserveQuantity: currentReserveFromState !== undefined ? currentReserveFromState : 0,
                    };
                }
            });
        });
        return Object.values(uniqueProducts);
    };

    /*const getStatusLabel = (statusCode: string) => {
        const statusEntry = LOCAL_STATUS_DISPLAY_MAP[statusCode as keyof typeof LOCAL_STATUS_DISPLAY_MAP];
        return statusEntry ? statusEntry.label : statusCode;
    };

    const getStatusBadgeColor = (status: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
        const statusEntry = LOCAL_STATUS_DISPLAY_MAP[status as keyof typeof LOCAL_STATUS_DISPLAY_MAP];
        return (statusEntry ? statusEntry.color : "info") as "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
    };*/

    return (
        <>
            {!showLoadList && (
                <Paper sx={{ mt: 3, p: 2, borderRadius: "8px", elevation: 2 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Stopps auf der Route
                    </Typography>
                    {stops && stops.length > 0 ? (
                        stops.map((stop, originalIndex) => {
                            if (originalIndex === 0 && !stop.order?.id && canChangeStatus) {
                                return null;
                            }

                            return (
                                <Card key={stop.order?.id || `stop-${originalIndex}`} sx={{ mb: 2, borderRadius: "8px", boxShadow: 1 }}>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    mr: 2
                                                }}
                                            >
                                                {stop?.order?.address || stop?.name || 'Unbekannte Adresse'}
                                                {/* Removed the Typography component that displayed status here */}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                                                <IconButton color="primary" onClick={() => handleExportToGoogleMaps(stop?.order?.address || stop?.name || "")} size="small">
                                                    <LocationOnOutlinedIcon />
                                                </IconButton>
                                                {onOpenDetailsDialog && (
                                                    <IconButton color="primary" onClick={() => onOpenDetailsDialog(stop)} size="small">
                                                        <InfoOutlinedIcon />
                                                    </IconButton>
                                                )}
                                                {onOpenBillingDialog && (
                                                    <IconButton color="primary" onClick={() => onOpenBillingDialog(stop)} size="small">
                                                        <ReceiptOutlinedIcon />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        </Box>

                                        {canChangeStatus && stop.order?.id && (
                                            <FormControl fullWidth sx={{ mt: 1 }} size="small">
                                                <InputLabel id={`status-select-label-${stop.order.id || originalIndex}`}>Status ändern</InputLabel>
                                                <Select
                                                    labelId={`status-select-label-${stop.order.id || originalIndex}`}
                                                    id={`status-select-${stop.order.id || originalIndex}`}
                                                    value={stop?.status || 'pending'}
                                                    label="Status ändern"
                                                    onChange={(e) => handleStatusChange(originalIndex, e.target.value as string)}
                                                >
                                                    {DRIVER_ORDER_STATUSES.map((statusOption) => (
                                                        <MenuItem key={statusOption.value} value={statusOption.value}>
                                                            {statusOption.label}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <Typography>Keine Stopps auf dieser Route verfügbar.</Typography>
                    )}
                </Paper>
            )}

            {showLoadList && (
                <Paper sx={{ mt: 3, p: 2, borderRadius: "8px", elevation: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Ladeliste bearbeiten (Gesamt mit Reserve)
                    </Typography>
                    <List>
                        {getTotalProductsList().length > 0 ? (
                            getTotalProductsList().map((product) => (
                                <ListItem key={product.productId} sx={{ py: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography sx={{ width: '30%' }}>{product.name}</Typography>
                                    <Typography sx={{ width: '20%', textAlign: 'center', color: 'textSecondary' }}>
                                        Benötigt: {product.requiredQuantity}
                                    </Typography>
                                    <Typography sx={{ width: '20%', textAlign: 'center', color: 'textSecondary' }}>
                                        Reserve: {product.reserveQuantity}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '30%', justifyContent: 'flex-end' }}>
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
                                    </Box>
                                </ListItem>
                            ))
                        ) : (
                            <Typography>Keine Produkte in dieser Route.</Typography>
                        )}
                    </List>
                    {onSaveTotalQuantities && routeId !== undefined && (
                        <Button variant="contained" color="primary" onClick={handleSaveTotalQuantitiesInternal} sx={{ mt: 2 }}>
                            Reservemengen speichern
                        </Button>
                    )}
                </Paper>
            )}
        </>
    );
};

export default AddressList;