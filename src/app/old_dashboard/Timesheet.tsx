import { useEffect, useState } from "react";
import { Paper, Typography, Box } from "@mui/material";

const getNextSaturday = () => {
    const now = new Date();
    const saturday = new Date(now.getTime());
    const currentDay = now.getDay();
    let daysToAdd = (6 - currentDay + 7) % 7;
    if (daysToAdd === 0) {
        daysToAdd = 7;
    }

    saturday.setDate(now.getDate() + daysToAdd);
    saturday.setHours(8, 0, 0, 0);
    return saturday;
};

const getTimeUntilNextSaturday = () => {
    const now = new Date();
    const nextSaturday = getNextSaturday();
    const diffMilliseconds = nextSaturday.getTime() - now.getTime();
    return Math.max(0, Math.floor(diffMilliseconds / 1000));
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

    const totalSeconds = 7 * 24 * 60 * 60; // Sekunden in einer Woche
    const percentage = timeLeft / totalSeconds; // Anteil der verbleibenden Zeit
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference * (1 - percentage);

    const formatTime = (seconds: number) => {
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
                        transform="scale(-1, 1) translate(-120, 0) rotate(-90 60 60)"
                    />
                </svg>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    {formatTime(timeLeft)}
                </Typography>
            </Box>
        </Paper>
    );
}
