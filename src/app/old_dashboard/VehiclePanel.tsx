import { useEffect, useState } from "react";
import { Vehicle } from "../../domain/Vehicle";
import { API_BASE_URL } from "../../../apiConfig.ts";

interface VehiclePanelProps {
    vehicle: Vehicle;
}

const VehiclePanel = ({ vehicle }: VehiclePanelProps) => {
    const [stops, setStops] = useState<string[]>([]); // State für Stops
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Wenn eine routeId vorhanden ist, lade die Stops
        if (vehicle.routeId !== 0) {
            async function fetchRouteData() {
                setLoading(true);
                try {
                    const response = await fetch(`${API_BASE_URL}/route/${vehicle.routeId}`);
                    const routeData = await response.json();

                    // Debugging: Zeigt die gesamte API-Antwort in der Konsole an
                    console.log("Route data:", routeData);

                    // Überprüfen, ob rawStops im API-Datenobjekt vorhanden sind
                    if (routeData.rawStops && Array.isArray(routeData.rawStops)) {
                        const stopsList = routeData.rawStops.map((stop: { name: string }) => stop.name);
                        setStops(stopsList); // Setze die Stopps
                    } else {
                        setError("Keine Stops gefunden");
                    }
                } catch (error) {
                    console.error("Fehler beim Laden der Route:", error);
                    setError("Fehler beim Laden der Route");
                } finally {
                    setLoading(false);
                }
            }

            fetchRouteData();
        }
    }, [vehicle.routeId]);

    return (
        <div className="vehicle-panel">
            <h3>Fahrzeug: {vehicle.licensePlate}</h3>
            {vehicle.routeId === 0 ? (
                <p><em>Keine Route hinzugefügt</em></p>
            ) : (
                <div>
                    {loading ? (
                        <p>Lädt...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <div>
                            <h4>Stops:</h4>
                            {stops.length > 0 ? (
                                <ul>
                                    {stops.map((stop, index) => (
                                        <li key={index}>{stop}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Keine Stops verfügbar</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VehiclePanel;
