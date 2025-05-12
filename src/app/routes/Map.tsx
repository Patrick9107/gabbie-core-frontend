import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from "@react-google-maps/api";
import { Fab, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const GOOGLE_MAPS_API_KEY = "AIzaSyApPuaS2JBlsXJpN7wvGzQEXK5w9nlUgE0";
const containerStyle = {
    width: "100%",
    height: "70vh",
};

const MapComponent = ({ routeData }: { routeData: any }) => {
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
    const [userLocation, setUserLocation] = useState<google.maps.LatLng | null>(null);
    const [reloadMap, setReloadMap] = useState<boolean>(false);

    const fixedOrigin = "Heldenpl. 23, 2440 Reisenberg";  // das ist scuffed

    useEffect(() => {
        if (!routeData || !window.google) return;
        if (!reloadMap) return; // Nur reloaden, wenn reloadMap TRUE ist

        const directionsService = new google.maps.DirectionsService();
        const { destination, waypoints } = routeData;

        directionsService.route(
            {
                origin: fixedOrigin,
                destination,
                waypoints: waypoints.map((wp: { location: string }) => ({ location: wp.location, stopover: true })),
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                } else {
                    console.error("Error fetching directions:", status);
                }
            }
        );
    }, [reloadMap, routeData]); // Füge routeData als Abhängigkeit hinzu

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const location = window.google ? new google.maps.LatLng(position.coords.latitude, position.coords.longitude) : null;
                console.log('User Location:', location);
                setUserLocation(location);
            },
            (error) => console.error("Error getting location:", error),
            { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    const handleReloadMap = () => {
        setReloadMap(true);
    };

    return (
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={userLocation || { lat: 47.999649, lng: 16.524391 }} // Reisenberg Koordinaten
                zoom={14}
            >
                {directions && <DirectionsRenderer directions={directions} />}
                {userLocation && (
                    <Marker
                        position={userLocation}
                    />
                )}
            </GoogleMap>

            <Tooltip title="Karte neu laden">
                <Fab
                    color="primary"
                    aria-label="reload"
                    onClick={handleReloadMap}
                    sx={{ position: 'absolute', bottom: '20px', right: '20px' }}
                >
                    <RefreshIcon />
                </Fab>
            </Tooltip>
        </LoadScript>
    );
};

export default React.memo(MapComponent);