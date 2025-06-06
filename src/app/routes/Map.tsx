import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from "@react-google-maps/api";
import { Fab, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const Maps_API_KEY = "AIzaSyApPuaS2JBlsXJpN7wvGzQEXK5w9nlUgE0"; // HINWEIS: API-Key sichern!

// --- ANPASSUNG HIER ---
// Die Höhe wird auf 100% gesetzt, damit die Karte den Container ausfüllt, in dem sie platziert wird.
const containerStyle = {
    width: "100%",
    height: "100%",
};

const MapComponent = ({ routeData }: { routeData: any }) => {
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(null);
    const [mapRefreshTrigger, setMapRefreshTrigger] = useState<number>(0);

    const fixedOrigin = "Heldenpl. 23, 2440 Reisenberg";

    const calculateAndSetDirections = useCallback(() => {
        if (!routeData || !window.google) {
            setDirections(null);
            return;
        }

        const directionsService = new window.google.maps.DirectionsService();
        const { rawStops } = routeData;

        if (!Array.isArray(rawStops) || rawStops.length === 0) {
            setDirections(null);
            return;
        }

        const stopsToProcess = rawStops.filter((stop: any) => stop && stop.name);
        if (stopsToProcess.length === 0) {
            setDirections(null);
            return;
        }

        // Der erste Stopp ist immer der Startpunkt
        const originAddress = stopsToProcess[0].name || fixedOrigin;
        let destinationAddress: string = originAddress; // Ziel ist gleich Start, wenn nur ein Stopp da ist
        let waypointsList: google.maps.DirectionsWaypoint[] = [];

        if (stopsToProcess.length > 1) {
            destinationAddress = stopsToProcess[stopsToProcess.length - 1].name;
            waypointsList = stopsToProcess.slice(1, -1).map((stop: any) => ({
                location: stop.name,
                stopover: true
            }));
        }

        directionsService.route(
            {
                origin: originAddress,
                destination: destinationAddress,
                waypoints: waypointsList,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK && result) {
                    setDirections(result);
                } else {
                    console.error("Error fetching directions:", status);
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
                }
            },
            (error) => console.error("Error getting location:", error),
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    const handleReloadMap = () => {
        setMapRefreshTrigger(prev => prev + 1);
    };

    const defaultCenter = { lat: 47.999649, lng: 16.524391 }; // Reisenberg Koordinaten

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
                        position: 'absolute', // Absolute Positionierung relativ zum Paper-Container
                        bottom: '16px',
                        right: '16px',
                        zIndex: 1
                    }}
                >
                    <RefreshIcon />
                </Fab>
            </Tooltip>
        </LoadScript>
    );
};

export default React.memo(MapComponent);