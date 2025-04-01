import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchOrders } from "../../infra/api/orderService.ts";
import { OrderResponse } from "../../domain/OrderResponse.ts";

function OrderList() {
    const [orders, setOrders] = useState<OrderResponse[]>([]);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const fetchedOrders: OrderResponse[] = await fetchOrders();
                const sortedOrders = fetchedOrders
                    .filter(order => order.createdAt !== null)
                    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
                    .slice(0, 10);
                setOrders(sortedOrders);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        };
        loadOrders();
    }, []);

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Bestellübersicht</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Best Nr.</TableCell>
                        <TableCell>Datum</TableCell>
                        <TableCell>Adresse</TableCell>
                        <TableCell>Produkte</TableCell>
                        <TableCell>Preis</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order, index) => (
                        <TableRow key={order.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{order.createdAt ? new Date(order.createdAt).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" }) : "-"}</TableCell>
                            <TableCell>{order.address}</TableCell>
                            <TableCell>{order.orderItems.length}</TableCell>
                            <TableCell>{order.totalAmount.toFixed(2)}€</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default OrderList;
