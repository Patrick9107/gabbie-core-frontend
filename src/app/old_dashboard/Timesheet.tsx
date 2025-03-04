import { useEffect, useState } from "react";
import { Paper, Typography, Box } from "@mui/material";

const getNextSaturday = () => {
    const now = new Date();
    const saturday = new Date();
    saturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7));
    saturday.setHours(8, 0, 0, 0);
    return saturday;
};

const getTimeUntilNextSaturday = () => {
    const now = new Date();
    const nextSaturday = getNextSaturday();
    return Math.floor((nextSaturday - now) / 1000);
};

export default function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState(getTimeUntilNextSaturday());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    return getTimeUntilNextSaturday();
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const percentage = (timeLeft / (7 * 24 * 60 * 60)) * 100;
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - percentage / 100);

    const formatTime = (seconds) => {
        const days = Math.floor(seconds / (24 * 60 * 60));
        const hours = Math.floor((seconds % (24 * 60 * 60)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${days}d ${hours}h ${minutes}m ${secs}s`;
    };

    return (
        <Paper sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="h6">Zeit bis zum nächsten Liefer-Wochenende</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 2 }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        stroke="#e0e0e0"
                        strokeWidth="10"
                    />
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </svg>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    {formatTime(timeLeft)}
                </Typography>
            </Box>
        </Paper>
    );
}
