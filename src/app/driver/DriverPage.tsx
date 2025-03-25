import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";
import Map from "../routes/Map";
import AddressList from "../routes/AddressList";
import { deserializeRouteData } from "./DriverUtils";

const DriverPage = () => {
    const [vehicle, setVehicle] = useState<any | null>(null);
    const [routeData, setRouteData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVehicle = async () => {
            let storedVehicleName = localStorage.getItem("name"); // e.g., "Fahrzeug-A"

            if (!storedVehicleName) {
                setError("No vehicle assigned to the logged-in user.");
                return;
            }

            // Extract license plate by removing "Fahrzeug-"
            if (storedVehicleName.startsWith("Fahrzeug-")) {
                storedVehicleName = storedVehicleName.substring(9);
            }

            try {
                const response = await axios.get(`${API_BASE_URL}/vehicle`);
                if (response.status === 200) {
                    const foundVehicle = response.data.find((v: any) => v.licensePlate === storedVehicleName);

                    if (foundVehicle) {
                        setVehicle(foundVehicle);
                    } else {
                        setError("Vehicle not found.");
                    }
                } else {
                    setError("Failed to fetch vehicles.");
                }
            } catch (error) {
                setError("Error fetching vehicle data.");
            }
        };

        fetchVehicle();
    }, []);

    useEffect(() => {
        const fetchRouteData = async (routeId: string) => {
            setIsLoading(true);
            setError(null);

            try {
                const routeResponse = await axios.get(`${API_BASE_URL}/route/${routeId}`);
                if (routeResponse.status === 200) {
                    const deserializedRouteData = deserializeRouteData(routeResponse.data.routeData);
                    setRouteData(deserializedRouteData);
                } else {
                    setError("Failed to fetch route data.");
                }
            } catch (error) {
                setError("Error fetching route data.");
            } finally {
                setIsLoading(false);
            }
        };

        if (vehicle?.routeId) {
            fetchRouteData(vehicle.routeId);
        }
    }, [vehicle]);

    return (
        <div>
            <h1>Lieferanten Ansicht</h1>

            {/* Loading or Error handling */}
            {isLoading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Show only the logged-in vehicle */}
            {vehicle && <p>Fahrzeug mit der Lizenznummer {vehicle.licensePlate}</p>}

            {/* Map and Address List */}
            {routeData && routeData.rawStops && (
                <>
                    <Map routeData={routeData} />
                    <AddressList
                        stops={routeData.rawStops}
                        handleStatusChange={(index: number, status: string) => {
                            const updatedStops = [...routeData.rawStops];
                            updatedStops[index].status = status;
                            setRouteData({ ...routeData, rawStops: updatedStops });
                        }}
                        handleOpenDialog={(stop) => {
                            console.log("openDialog stop:", stop);
                        }}
                        handleExportToGoogleMaps={(address: string) => {
                            const encodedAddress = encodeURIComponent(address);
                            const url = `https://www.google.com/maps?q=${encodedAddress}`;
                            window.open(url, "_blank");
                        }}
                    />
                </>
            )}
        </div>
    );
};

export default DriverPage;
