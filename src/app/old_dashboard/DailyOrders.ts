import { useEffect, useState } from "react";
import { fetchOrders } from "../../infra/api/orderService.ts";
import { OrderResponse } from "../../domain/OrderResponse.ts";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { Typography } from "@mui/material";
import type {} from '@mui/lab/themeAugmentation';



export function useOrders() {
    const [orders, setOrders] = useState<OrderResponse[]>([]);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const fetchedOrders = await fetchOrders();
                setOrders(fetchedOrders);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        };

        loadOrders();
    }, []);

    return orders;
}

export default function OrderTimeline(){
    const orders = useOrders();

    return(
        <Timeline position="alternate">
            {orders.map((order, index) => (
                    <TimelineItem key={order.id}>
                    <TimelineSeparator>
                        <TimelineDot variant="outlined" color={index % 2 === 0 ? "primary" : "secondary"} />
    {index < orders.length - 1 && <TimelineConnector />}
    </TimelineSeparator>
    <TimelineContent>
    <Typography variant="h6">Bestellung #{order.id}</Typography>
        <Typography variant="body2">
        Erstellt am: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "Unbekannt"}
    </Typography>
    </TimelineContent>
    </TimelineItem>
))}
    </Timeline>
    );
}
