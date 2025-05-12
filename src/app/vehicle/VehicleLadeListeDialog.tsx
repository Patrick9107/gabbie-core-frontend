import { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { API_BASE_URL } from "../../../apiConfig";

interface Props {
    open: boolean;
    onClose: () => void;
    routeId: number;
}

function OrderSummaryDialog({ open, onClose, routeId }: Props) {
    const [orders, setOrders] = useState<any[]>([]); // Bestellungen
    const [total, setTotal] = useState<number>(0); // Gesamtsumme

    // Funktion zum Abrufen der Bestellübersicht
    const fetchOrderSummary = async () => {
        if (!routeId || routeId === 0) return;

        try {
            const response = await fetch(`${API_BASE_URL}/Route/${routeId}/orders`); // Endpoint für Bestellübersicht
            if (!response.ok) throw new Error(`Fehler: ${response.status}`);

            const data = await response.json();
            setOrders(data.orders || []); // Bestellungen setzen
            setTotal(calculateTotal(data.orders || [])); // Gesamtsumme berechnen
        } catch (error) {
            console.error("Fehler beim Abrufen der Bestellübersicht:", error);
            setOrders([]);
            setTotal(0);
        }
    };

    // Funktion zum Berechnen der Gesamtsumme
    const calculateTotal = (orders: any[]) => {
        return orders.reduce((sum, order) => sum + order.price * order.quantity, 0); // Preis * Menge
    };

    // Fetch Bestellübersicht beim Öffnen des Dialogs
    useEffect(() => {
        if (open) {
            fetchOrderSummary();
        }
    }, [open, routeId]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
            <DialogTitle>Bestellübersicht</DialogTitle>
            <DialogContent>
                {orders.length > 0 ? (
                    <>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Produktname</TableCell>
                                    <TableCell>Menge</TableCell>
                                    <TableCell>Preis</TableCell>
                                    <TableCell>Gesamtpreis</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{order.productName}</TableCell>
                                        <TableCell>{order.quantity}</TableCell>
                                        <TableCell>{order.price.toFixed(2)} €</TableCell>
                                        <TableCell>{(order.price * order.quantity).toFixed(2)} €</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Typography variant="h6" sx={{ marginTop: 2 }}>
                            Gesamtsumme: {total.toFixed(2)} €
                        </Typography>
                    </>
                ) : (
                    <Typography variant="body1">Keine Bestellungen verfügbar.</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Schließen</Button>
            </DialogActions>
        </Dialog>
    );
}

export default OrderSummaryDialog;
