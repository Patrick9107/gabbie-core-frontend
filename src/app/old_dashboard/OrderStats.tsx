import { Paper, Typography, Box, LinearProgress } from "@mui/material";

const stats = [
    { label: "Kraut", value: 3.45, max: 8 },
    { label: "Kartoffel", value: 28, max: 40 },
    { label: "Paprika", value: 90, max: 160 },
    { label: "Eingelegtes", value: 90, max: 160 },
    { label: "Äpfel", value: 5, max: 10 },
];

function OrderStats() {
    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Bestellstatistik</Typography>
            {stats.map((stat, index) => (
                <Box key={index} sx={{ mt: 2 }}>
                    <Typography variant="body2">{stat.label}</Typography>
                    <LinearProgress
                        variant="determinate"
                        value={(stat.value / stat.max) * 100}
                        sx={{ height: 10, borderRadius: 5 }}
                    />
                </Box>
            ))}
        </Paper>
    );
}

export default OrderStats;