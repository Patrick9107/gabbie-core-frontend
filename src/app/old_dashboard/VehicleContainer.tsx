import { useEffect, useState } from "react";
import { Vehicle } from "../../domain/Vehicle"; // Ensure this import is correct
import VehiclePanelList from "./VehiclePanelList";
import { API_BASE_URL } from "../../../apiConfig.ts";

const VehicleDataContainer = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Initial loading state for vehicles

    useEffect(() => {
        async function fetchVehicles() {
            setLoading(true); // Set loading true before fetch
            try {
                const response = await fetch(`${API_BASE_URL}/vehicle`);
                if (!response.ok) { // Check for HTTP errors
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setVehicles(data);
            } catch (error) {
                console.error("Fehler beim Laden der Fahrzeugdaten:", error);
                // Optionally set an error state here if you want to display it
            } finally {
                setLoading(false); // End loading regardless of success or failure
            }
        }

        fetchVehicles();
    }, []);

    // It's better to show a spinner/message than just 'p' tag
    return loading ? (
        <p>Lade Fahrzeuge...</p> // Or a Material-UI CircularProgress
    ) : (
        <VehiclePanelList vehicles={vehicles} />
    );
};

export default VehicleDataContainer;