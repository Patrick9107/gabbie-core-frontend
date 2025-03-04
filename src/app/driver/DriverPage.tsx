import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";
import Map from "../routes/Map";
import AddressList from "../routes/AddressList";
import { deserializeRouteData } from "./DriverUtils"; 

const DriverPage = () => {
    const [vehicles, setVehicles] = useState<any[]>([]);
    const [routeData, setRouteData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); 
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/vehicle`);
                if (response.status === 200) {
                    setVehicles(response.data);
                } else {
                    setError("Failed to fetch vehicles.");
                }
            } catch (error) {
                setError("Error fetching vehicles.");
            }
        };

        fetchVehicles();
    }, []);
    
    useEffect(() => {
        const fetchRouteData = async (routeId: string) => {
            setIsLoading(true);
            setError(null); 

            try {
                const routeResponse = await axios.get(`${API_BASE_URL}/route/${routeId}`);
                console.log("Route Response:", routeResponse);  

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

        if (vehicles.length > 0) {
            const routeId = vehicles[0]?.routeId;
            if (routeId) {
                fetchRouteData(routeId);
            }
        }
    }, [vehicles]);

    return (
        <div>
            <h1>Lieferanten Ansicht</h1>

            {/* Loading or Error handling */}
            {isLoading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Vehicle list */}
            <ul>
                {vehicles.map((vehicle) => (
                    <li key={+vehicle.id}>Fahrzeug mit der Lizenznummer {vehicle.licensePlate}</li>
                ))}
            </ul>

            {/* Map and Address List */}
            {routeData && routeData.rawStops && (
                <>
                    <Map routeData={routeData} />
                    <AddressList
                        stops={routeData.rawStops} // Use the rawStops from routeData
                        handleStatusChange={(index: number, status: string) => {
                            const updatedStops = [...routeData.rawStops];
                            updatedStops[index].status = status;
                            setRouteData({ ...routeData, rawStops: updatedStops }); // Update stop status
                        }}
                        handleOpenDialog={(stop) => {
                            console.log("ipoenDialog stop:", stop);
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
