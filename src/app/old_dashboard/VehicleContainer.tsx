import { useEffect, useState } from "react";
import { Vehicle } from "../../domain/Vehicle";
import VehiclePanelList from "./VehiclePanelList"; // Die Komponente, die die Fahrzeug-Panels rendert
import { API_BASE_URL } from "../../../apiConfig.ts";

const VehicleDataContainer = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch Fahrzeugdaten
    useEffect(() => {
        async function fetchVehicles() {
            try {
                const response = await fetch(`${API_BASE_URL}/vehicle`); // API-Anfrage
                const data = await response.json();
                setVehicles(data); // Setzt die Fahrzeugdaten im State
            } catch (error) {
                console.error("Fehler beim Laden der Fahrzeugdaten:", error);
            } finally {
                setLoading(false); // Beendet das Laden
            }
        }

        fetchVehicles();
    }, []);

    return loading ? (
        <p>Loading...</p>
    ) : (
        <VehiclePanelList vehicles={vehicles} /> // Weitergabe der Fahrzeugdaten an die Panel-Liste
    );
};

export default VehicleDataContainer;
