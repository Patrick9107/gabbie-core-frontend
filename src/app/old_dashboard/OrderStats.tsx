import { Paper, Typography, Box, LinearProgress } from "@mui/material";

const stats = [
    { label: "Kraut", value: 3.45, max: 8, color: "#F4D35E" },
    { label: "Kartoffel", value: 28, max: 40, color: "#F4A261" },
    { label: "Paprika", value: 90, max: 160, color: "#F95F5F" },
    { label: "Eingelegtes", value: 90, max: 160, color: "#2D9CDB" },
    { label: "Äpfel", value: 5, max: 10, color: "#68D2A4" },
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
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: "#e0e0e0",
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: stat.color,
                            },
                        }}
                    />
                </Box>
            ))}
        </Paper>
    );
}

export default OrderStats;
