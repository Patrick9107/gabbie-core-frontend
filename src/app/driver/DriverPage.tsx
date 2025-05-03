import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig";
import Map from "../routes/Map";
import AddressList from "../routes/AddressList";
import { Button } from "@mui/material";
import { deserializeRouteData } from "./DriverUtils";

const DriverPage = () => {
    const [vehicle, setVehicle] = useState<any | null>(null);
    const [routeData, setRouteData] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVehicle = async () => {
            let storedVehicleName = localStorage.getItem("name"); // Fahrzeug-A

            if (!storedVehicleName) {
                setError("No vehicle assigned to the logged-in user.");
                return;
            }

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

    const handleStatusChange = async (index: number, status: string) => {
        if (!routeData?.rawStops) return;

        const updatedStops = [...routeData.rawStops];
        const stop = updatedStops[index];

        if (!stop || !stop.order?.id) {
            console.warn("No order found for this stop:", stop);
            return;
        }

        // Update UI first (optimistic update)
        stop.status = status;
        setRouteData({ ...routeData, rawStops: updatedStops });

        try {
            // Send the updated status to the backend
            await axios.patch(`${API_BASE_URL}/order/${stop.order.id}`, { status });

            console.log(`Order ${stop.order.id} status updated to ${status}`);
        } catch (error) {
            console.error("Failed to update order status:", error);
            setError("Error updating order status.");
        }
    };

    const handleCompleteRoute = async () => {
        if (!routeData?.rawStops || !vehicle?.routeId) return;

        const confirmComplete = window.confirm("Are you sure you want to complete the route and delete only completed orders?");

        if (!confirmComplete) return;

        try {
            for (const stop of routeData.rawStops) {
                if (stop.status !== "completed") {
                    console.log(`Skipping stop with orderId ${stop.order?.id} - Status: ${stop.status}`);
                    continue;
                }

                const orderId = stop.orderId || stop.order?.id;
                if (!orderId) {
                    console.warn("Skipping stop - no orderId found:", stop);
                    continue;
                }

                await axios.delete(`${API_BASE_URL}/order/${orderId}`);
                console.log(`Deleted order with ID: ${orderId}`);
            }

            console.log("Completed orders deleted successfully.");

            const remainingOrders = routeData.rawStops.filter((stop: any) => stop.status !== "completed");

            if (remainingOrders.length === 0) {
                // If all orders were completed and deleted, reset the vehicle's routeId
                const updatedVehicle = { ...vehicle, routeId: 0 };
                await axios.put(`${API_BASE_URL}/vehicle/${vehicle.id}`, updatedVehicle);
                setVehicle((prev: any) => (prev ? { ...prev, routeId: 0 } : null));
                setRouteData(null);
                alert("All completed orders have been deleted, and the route has been cleared.");
            } else {
                // Update state to remove deleted orders while keeping others
                setRouteData({ ...routeData, rawStops: remainingOrders });
                alert("Completed orders have been deleted. Incomplete orders remain.");
            }
        } catch (error) {
            setError("Failed to complete the route.");
            console.error("Error deleting orders or updating vehicle:", error);
        }
    };

    return (
        <div>
            <h1>Lieferanten Ansicht</h1>

            {isLoading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {vehicle && <p>Fahrzeug mit der Lizenznummer {vehicle.licensePlate}</p>}

            {routeData && routeData.rawStops && (
                <>
                    <Map routeData={routeData} />
                    <AddressList
                        stops={routeData.rawStops}
                        handleStatusChange={handleStatusChange}
                        handleExportToGoogleMaps={(address: string) => {
                            const encodedAddress = encodeURIComponent(address);
                            const url = `https://www.google.com/maps?q=${encodedAddress}`;
                            window.open(url, "_blank");
                        }}
                    />
                </>
            )}

            {vehicle?.routeId && (
                <Button
                    variant="contained"
                    color="success"
                    sx={{
                        fontSize: "1rem",
                        width: "100%",
                        maxWidth: "300px",
                        marginTop: "20px",
                        padding: "14px",
                    }}
                    onClick={handleCompleteRoute}
                >
                    Complete Route
                </Button>
            )}
        </div>
    );
};

export default DriverPage;
