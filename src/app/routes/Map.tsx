import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from "@react-google-maps/api";
import { Button } from '@mui/material';

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
    }, [routeData, reloadMap]);  

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

    const handleExportToGoogleMaps = () => {
        if (!routeData) return;

        const destination = encodeURIComponent(routeData.destination);

        const waypoints = routeData.waypoints
            .map((wp: { location: string }) => encodeURIComponent(wp.location))
            .slice(0, 9)
            .join('/');

        const finalRoute = `https://www.google.com/maps/dir/${encodeURIComponent(fixedOrigin)}/${waypoints}/${destination}`;

        window.open(finalRoute, '_blank');
    };

    const handleReloadMap = () => {
        setReloadMap(!reloadMap);  
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

            <Button
                variant="contained"
                color="primary"
                onClick={handleExportToGoogleMaps}
                sx={{ position: 'absolute', top: '10px', right: '10px' }}
            >
                Open in Google Maps
            </Button>

            <Button
                variant="contained"
                color="secondary"
                onClick={handleReloadMap}
                sx={{ position: 'absolute', top: '50px', right: '10px' }}
            >
                Reload Map
            </Button>
        </LoadScript>
    );
};

export default React.memo(MapComponent);
