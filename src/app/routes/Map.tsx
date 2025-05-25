import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from "@react-google-maps/api";
import { Fab, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const Maps_API_KEY = "AIzaSyApPuaS2JBlsXJpN7wvGzQEXK5w9nlUgE0"; // REMINDER: Secure this API key!
const containerStyle = {
    width: "100%",
    height: "70vh",
};

const MapComponent = ({ routeData }: { routeData: any }) => {
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(null);
    const [mapRefreshTrigger, setMapRefreshTrigger] = useState<number>(0);

    const fixedOrigin = "Heldenpl. 23, 2440 Reisenberg";

    const calculateAndSetDirections = useCallback(() => {
        console.log("MapComponent: Attempting to calculate directions...");
        console.log("Received routeData:", routeData);

        if (!routeData || !window.google) {
            setDirections(null);
            console.warn("MapComponent: routeData or Google API not loaded.");
            return;
        }

        const directionsService = new window.google.maps.DirectionsService();

        const { rawStops } = routeData;

        let originAddress: string = fixedOrigin;
        let destinationAddress: string = '';
        let waypointsList: google.maps.DirectionsWaypoint[] = [];

        if (!Array.isArray(rawStops) || rawStops.length === 0) {
            console.warn("MapComponent: rawStops array is empty or not an array.");
            setDirections(null);
            return;
        }

        const stopsToProcess = rawStops.filter((stop: any) => stop && stop.name);

        if (stopsToProcess.length === 0) {
            console.warn("MapComponent: No valid stops found in rawStops after filtering.");
            setDirections(null);
            return;
        }

        if (stopsToProcess.length === 1) {
            destinationAddress = stopsToProcess[0].name;
            waypointsList = [];
        } else {
            destinationAddress = stopsToProcess[stopsToProcess.length - 1].name;
            const potentialWaypoints = stopsToProcess.slice(1, stopsToProcess.length - 1);
            waypointsList = potentialWaypoints.map((stop: any) => ({
                location: stop.name,
                stopover: true
            }));
        }

        if (!originAddress.trim() || !destinationAddress.trim()) {
            console.warn("MapComponent: Origin or Destination address is invalid after derivation.", { originAddress, destinationAddress });
            setDirections(null);
            return;
        }

        console.log("MapComponent: Requesting directions with:", {
            origin: originAddress,
            destination: destinationAddress,
            waypoints: waypointsList
        });

        directionsService.route(
            {
                origin: originAddress,
                destination: destinationAddress,
                waypoints: waypointsList,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
                if (status === window.google.maps.DirectionsStatus.OK && result) {
                    setDirections(result);
                    console.log("Directions fetched successfully.");
                } else {
                    console.error("Error fetching directions:", status, result);
                    setDirections(null);
                }
            }
        );
    }, [routeData, fixedOrigin]);

    useEffect(() => {
        calculateAndSetDirections();
    }, [routeData, mapRefreshTrigger, calculateAndSetDirections]);

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                if (window.google) {
                    const location = new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    setUserLocation(location);
                } else {
                    console.warn("Google Maps API not loaded, cannot get user location.");
                }
            },
            (error) => console.error("Error getting location:", error),
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    const handleReloadMap = () => {
        setMapRefreshTrigger(prev => prev + 1);
    };

    const defaultCenter = { lat: 47.999649, lng: 16.524391 }; // Reisenberg Coordinates

    return (
        <LoadScript googleMapsApiKey={Maps_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={userLocation || defaultCenter}
                zoom={userLocation ? 16 : 14}
            >
                {directions && <DirectionsRenderer directions={directions} />}
                {userLocation && (
                    <Marker
                        position={userLocation}
                        icon={{
                            path: window.google.maps.SymbolPath.CIRCLE,
                            scale: 8,
                            fillColor: '#4285F4',
                            fillOpacity: 1,
                            strokeWeight: 2,
                            strokeColor: '#FFFFFF',
                        }}
                    />
                )}
            </GoogleMap>

            <Tooltip title="Karte neu laden">
                <Fab
                    color="primary"
                    aria-label="reload"
                    onClick={handleReloadMap}
                    sx={{
                        position: 'fixed', // CHANGED FROM 'absolute' to 'fixed'
                        bottom: '20px',
                        right: '20px',
                        zIndex: 1000
                    }}
                >
                    <RefreshIcon />
                </Fab>
            </Tooltip>
        </LoadScript>
    );
};

export default React.memo(MapComponent);