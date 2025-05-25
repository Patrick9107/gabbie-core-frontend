import { useEffect, useState } from "react";
import { Vehicle } from "../../domain/Vehicle"; // Assuming Vehicle type is defined here
import { API_BASE_URL } from "../../../apiConfig.ts";
import { Stop } from "../../domain/Stop"; // Import Stop type from your domain

interface VehiclePanelProps {
    vehicle: Vehicle;
}

const VehiclePanel = ({ vehicle }: VehiclePanelProps) => {
    const [routeStops, setRouteStops] = useState<Stop[]>([]); // State for Stop objects, not just names
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // If a routeId is present and not 0, load the route's stops
        if (vehicle.routeId !== 0) {
            async function fetchRouteData() {
                setLoading(true);
                setError(null); // Clear previous errors
                try {
                    const response = await fetch(`${API_BASE_URL}/route/${vehicle.routeId}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const routeData = await response.json();

                    // Debugging: Zeigt die gesamte API-Antwort in der Konsole an
                    // console.log(`Route data for vehicle ${vehicle.licensePlate} (Route ID: ${vehicle.routeId}):`, routeData);

                    // Check if rawStops is present and is an array
                    if (routeData.rawStops && Array.isArray(routeData.rawStops)) {
                        setRouteStops(routeData.rawStops); // Set the Stop objects
                    } else {
                        setError("Keine Stops gefunden oder unerwartetes Datenformat.");
                    }
                } catch (error) {
                    console.error(`Fehler beim Laden der Route für Fahrzeug ${vehicle.licensePlate} (Route ID: ${vehicle.routeId}):`, error);
                    setError("Fehler beim Laden der Route.");
                } finally {
                    setLoading(false);
                }
            }

            fetchRouteData();
        } else {
            // If routeId is 0, reset stops and loading state
            setRouteStops([]);
            setLoading(false);
            setError(null);
        }
    }, [vehicle.routeId, vehicle.licensePlate]); // Add licensePlate to dependency array for better logging

    // Calculate progress: completed stops count and current stop
    const totalStops = routeStops.length;
    const completedStopsCount = routeStops.filter(stop => stop.status === 'completed').length;

    // Determine the current stop or next pending stop
    let currentStopInfo = "Route beginnt bald";
    if (totalStops > 0) {
        if (completedStopsCount === totalStops) {
            currentStopInfo = "Route abgeschlossen";
        } else {
            // Find the first stop that is not completed
            const nextStop = routeStops.find(stop => stop.status !== 'completed');
            if (nextStop) {
                currentStopInfo = `Aktueller Stop: ${nextStop.name}`;
            } else {
                currentStopInfo = "Unbekannter Status"; // Fallback, should ideally not happen if totalStops > completedStopsCount
            }
        }
    }


    return (
        <div className="vehicle-panel">
            <h3>Fahrzeug: {vehicle.licensePlate}</h3>
            {loading ? (
                <p>Lädt Routendetails...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : vehicle.routeId === 0 ? (
                <p><em>Keine Route zugewiesen.</em></p>
            ) : (
                <div>
                    {totalStops > 0 ? (
                        <>
                            <p>
                                **Status:** {currentStopInfo}
                            </p>
                            <p>
                                **Fortschritt:** {completedStopsCount} von {totalStops} Stops abgeschlossen.
                            </p>
                            {/* You can still list all stops if desired, perhaps with their status */}
                            <h4>Alle Stops:</h4>
                            <ul>
                                {routeStops.map((stop, index) => (
                                    <li key={index}>
                                        {stop.name} ({stop.status === 'completed' ? 'Abgeschlossen' : 'Ausstehend'})
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p>Route hat keine definierten Stops.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default VehiclePanel;