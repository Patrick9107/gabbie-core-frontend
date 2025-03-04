import React from "react";
import { Button } from "@mui/material";
import { API_BASE_URL } from "../../../apiConfig.ts";  
import { RouteState } from "../../domain/RouteState.ts"; //ROUTE STATE MUSS EVENTUELL GELÖSCHT WERDEN

interface SaveRouteProps {
    routeData: RouteState | null; 
}

const SaveRoute: React.FC<SaveRouteProps> = ({ routeData }) => {
    const handleSaveRoute = async () => {
        if (!routeData) return;

        console.log("TESTESTSETSETSETSET"+JSON.stringify(routeData, null, 2));
        // Speichern des gesamten routeData als JSON
        const routePayload = {
            totalDuration: routeData.rawStops.reduce((sum, stop) => sum + stop.arrival, 0),
            totalDistance: routeData.rawStops.reduce((sum, stop) => sum + stop.distance, 0),
            startTime: new Date().toISOString(),
            endTime: new Date(new Date().getTime() + routeData.rawStops.reduce((sum, stop) => sum + stop.arrival, 0) * 60000).toISOString(),
            routeData: JSON.stringify(routeData),
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/Route`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(routePayload), 
            });

            console.log(routePayload);
            
            if (!response.ok) {
                throw new Error("Failed to save route");
            }

            const savedRoute = await response.json();
            console.log("Route saved successfully:", savedRoute);
        } catch (error) {
            console.error("Error saving route:", error);
        }
    };

    return (
        <Button variant="contained" color="primary" onClick={handleSaveRoute}>
            Save Route
        </Button>
    );
};

export default SaveRoute;
