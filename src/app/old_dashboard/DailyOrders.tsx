import { useEffect, useState } from "react";
import { fetchOrders } from "../../infra/api/orderService.ts";
import { OrderResponse } from "../../domain/OrderResponse.ts";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { Typography, Paper } from "@mui/material";
import type {} from "@mui/lab/themeAugmentation";

export function useOrders() {
    const [orders, setOrders] = useState<OrderResponse[]>([]);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const fetchedOrders = await fetchOrders();
                setOrders(Array.isArray(fetchedOrders) ? fetchedOrders : []);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                setOrders([]);
            }
        };

        loadOrders();
        const interval = setInterval(loadOrders, 5000); // Alle 5 Sekunden neu laden

        return () => clearInterval(interval);
    }, []);

    return orders.slice(-3);
}

export default function OrderTimeline() {
    const orders = useOrders();

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Bestellverlauf
            </Typography>
            <Timeline position="alternate">
                {orders.map((order, index) => {
                    const dotColor = index % 2 === 0 ? "#3d9970" : "#3c82f3";

                    return (
                        <TimelineItem key={order.id}>
                            <TimelineSeparator>
                                <TimelineDot
                                    variant="outlined"
                                    sx={{ borderColor: dotColor }}
                                />
                                {index < orders.length - 1 && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent>
                                <Typography variant="h6">Bestellung #{order.id}</Typography>
                                <Typography variant="body2">
                                    Erstellt am:{" "}
                                    {order.createdAt
                                        ? new Date(order.createdAt).toLocaleString()
                                        : "Unbekannt"}
                                </Typography>
                            </TimelineContent>
                        </TimelineItem>
                    );
                })}
            </Timeline>
        </Paper>
    );
}
