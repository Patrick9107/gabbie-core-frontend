import React from "react";
import { Box, Typography } from "@mui/material";
import { Stop } from "../../domain/Stop.ts";

interface Props {
    stops: Stop[];
    routeId: number;
}

const AddressExportList: React.FC<Props> = ({ stops }) => {
    if (!stops || stops.length === 0) return <p>Keine Stopps vorhanden.</p>;

    return (
        <Box sx={{ mt: 3, p: 2, border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Stopps auf der Route
            </Typography>

            {stops.slice(1).map((stop, index) => (
                <Box
                    key={index}
                    sx={{
                        p: 2,
                        mb: 1,
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        backgroundColor: "#ffffff",
                        boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Typography variant="h6">{stop.order?.address || "Unbekannte Adresse"}</Typography>
                    <Typography variant="body2">Ankunft: {stop.arrival} min</Typography>
                    <Typography variant="body2">Distanz: {stop.distance} km</Typography>
                </Box>
            ))}
        </Box>
    );
};

export default AddressExportList;
