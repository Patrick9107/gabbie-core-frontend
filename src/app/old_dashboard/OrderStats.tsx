import { useEffect, useState } from "react";
import { Paper, Typography, Box, LinearProgress } from "@mui/material";
import { Product } from "../../domain/Product.ts";

function OrderStats() {
    const [products, setProducts] = useState<Product[]>([]);
    const [orderStats, setOrderStats] = useState<{ label: string; count: number }[]>([]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch("/api/products");
                if (!res.ok) throw new Error("Fehler beim Abrufen der Produkte");
                const data: Product[] = await res.json();
                console.log("Produkte geladen:", data);
                setProducts(data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length === 0) return;

        async function fetchOrders() {
            try {
                const res = await fetch("/api/orders");
                if (!res.ok) throw new Error("Fehler beim Abrufen der Bestellungen");
                const data = await res.json();

                const orderCount: Record<string, number> = {};

                data.forEach((order: { items: { productId: string; quantity: number }[] }) => {
                    order.items.forEach((item) => {
                        orderCount[item.productId] = (orderCount[item.productId] || 0) + item.quantity;
                    });
                });

                const stats = Object.entries(orderCount).map(([productId, count]) => {
                    const product = products.find((p) => p.id === productId);
                    return { label: product?.name ?? "Unbekannt", count };
                });

                stats.sort((a, b) => b.count - a.count);
                setOrderStats(stats.length <= 6 ? stats : stats.slice(0, 6));
            } catch (error) {
                console.error(error);
            }
        }

        fetchOrders();
    }, [products]);

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Top Bestellte Produkte</Typography>
            {orderStats.length > 0 ? (
                orderStats.map((product, index) => (
                    <Box key={index} sx={{ mt: 2 }}>
                        <Typography variant="body2">{`${product.label} (${String(product.count)})`}</Typography>
                        <LinearProgress
                            variant="determinate"
                            value={Math.min((product.count / orderStats[0].count) * 100, 100)}
                            sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: "#e0e0e0",
                            }}
                        />
                    </Box>
                ))
            ) : (
                <Typography variant="body2">Keine Bestellungen vorhanden.</Typography>
            )}
        </Paper>
    );
}

export default OrderStats;
