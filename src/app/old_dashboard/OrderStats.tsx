import { useEffect, useState } from "react";
import { Paper, Typography, Box, LinearProgress } from "@mui/material";
import { fetchOrderedProductStats } from "../../infra/api/productService"; // ← Pfad ggf. anpassen

function OrderStats() {
    const [orderStats, setOrderStats] = useState<{ label: string; count: number }[]>([]);
    const MAX_COUNT = 2500;

    useEffect(() => {
        async function loadStats() {
            try {
                const data = await fetchOrderedProductStats(); // ← Axios-Call aus dem Service
                const stats = data
                    .map(entry => ({
                        label: entry.productName,
                        count: entry.count,
                    }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 6); // Top 6 Produkte
                setOrderStats(stats);
            } catch (error) {
                console.error("Fehler beim Laden der Bestellstatistiken:", error);
            }
        }

        loadStats();
    }, []);

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Top Bestellte Produkte</Typography>
            {orderStats.length > 0 ? (
                orderStats.map((product, index) => (
                    <Box key={index} sx={{ mt: 2 }}>
                        <Typography variant="body2">{`${product.label} (${product.count}/${MAX_COUNT})`}</Typography>
                        <LinearProgress
                            variant="determinate"
                            value={(product.count / MAX_COUNT) * 100}
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
