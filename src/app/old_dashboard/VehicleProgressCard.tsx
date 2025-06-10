import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    LinearProgress,
    Chip,
    Card,
    CardContent,
    Tooltip
} from '@mui/material';
import { Vehicle } from '../../domain/Vehicle';
import { Stop } from '../../domain/Stop';
import { API_BASE_URL } from '../../../apiConfig';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface VehicleProgressCardProps {
    vehicle: Vehicle;
}

const POLLING_INTERVAL = 15000; // 15 Sekunden

const FINISHED_STATUSES = ['completed', 'delivered'];

const VehicleProgressCard: React.FC<VehicleProgressCardProps> = ({ vehicle }) => {
    const [stops, setStops] = useState<Stop[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRouteData = async (isInitialLoad: boolean) => {
            if (isInitialLoad) setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${API_BASE_URL}/route/${vehicle.routeId}`);
                if (!response.ok) {
                    throw new Error(`Route nicht gefunden oder Fehler (${response.status})`);
                }
                const routeData = await response.json();

                if (routeData && routeData.routeData) {
                    const parsedData = JSON.parse(routeData.routeData);
                    console.log(`[DEBUG] Daten für Fahrzeug "${vehicle.licensePlate}" empfangen um ${new Date().toLocaleTimeString()}:`, { rohdten: routeData, geparsteStopps: parsedData.rawStops });

                    if (parsedData && Array.isArray(parsedData.rawStops)) {
                        setStops(parsedData.rawStops);
                    } else {
                        setStops([]);
                    }
                } else {
                    if (routeData && Array.isArray(routeData.rawStops)) {
                        setStops(routeData.rawStops);
                    } else {
                        setStops([]);
                    }
                }
            } catch (err: any) {
                console.error(`Fehler beim Laden der Route für Fahrzeug ${vehicle.licensePlate}:`, err);
                setError(err.message || "Fehler beim Laden der Route.");
            } finally {
                if (isInitialLoad) setLoading(false);
            }
        };

        if (vehicle.routeId && vehicle.routeId !== 0) {
            fetchRouteData(true);
            const intervalId = setInterval(() => {
                fetchRouteData(false);
            }, POLLING_INTERVAL);
            return () => clearInterval(intervalId);
        } else {
            setLoading(false);
            setStops([]);
        }
    }, [vehicle.routeId, vehicle.licensePlate]);

    const relevantStops = stops.filter(stop => stop.name?.trim().toLowerCase() !== 'reisenberg');
    const totalStops = relevantStops.length;
    const completedStops = relevantStops.filter(stop => FINISHED_STATUSES.includes(stop.status?.toLowerCase())).length;
    const progressPercentage = totalStops > 0 ? (completedStops / totalStops) * 100 : 0;
    const isFinished = totalStops > 0 && completedStops === totalStops;

    const getStatusInfo = () => {
        if (totalStops === 0 && vehicle.routeId !== 0) return "Route hat keine Stopps";
        if (isFinished) return "Route abgeschlossen";

        const nextStop = relevantStops.find(stop => !FINISHED_STATUSES.includes(stop.status?.toLowerCase()));
        if (nextStop) return `Nächster Halt: ${nextStop.name}`;

        if (totalStops > 0) return "In Bearbeitung...";
        return "Route nicht gestartet";
    };

    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'box-shadow 0.3s',
            '&:hover': { boxShadow: 6 }
        }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <DirectionsCarIcon sx={{ mr: 1.5, color: 'primary.main' }} />
                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                            {vehicle.licensePlate}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {(!vehicle.routeId || vehicle.routeId === 0) ? (
                        <Box sx={{ textAlign: 'center' }}>
                            <Chip icon={<PendingIcon />} label="Keine Route zugewiesen" variant="outlined" />
                        </Box>
                    ) : loading ? (
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">Lade Routendetails...</Typography>
                        </Box>
                    ) : error ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'error.main'}}>
                            <Tooltip title={error}>
                                <ErrorOutlineIcon sx={{ mr: 1}}/>
                            </Tooltip>
                            <Typography variant="body2">Fehler beim Laden</Typography>
                        </Box>
                    ) : (
                        <Box>
                            {/* --- ANPASSUNG HIER: `noWrap` wurde entfernt --- */}
                            <Typography variant="body2" color="text.secondary" sx={{ mb: totalStops > 0 ? 1 : 0, wordBreak: 'break-word' }}>
                                {getStatusInfo()}
                            </Typography>
                            {totalStops > 0 && (
                                <Tooltip title={`${Math.round(progressPercentage)}% abgeschlossen`}>
                                    <LinearProgress
                                        variant="determinate"
                                        value={progressPercentage}
                                        color={isFinished ? "success" : "primary"}
                                        sx={{ height: 8, borderRadius: 4 }}
                                    />
                                </Tooltip>
                            )}
                        </Box>
                    )}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, minHeight: '32px' }}>
                    {vehicle.routeId && vehicle.routeId !== 0 && !loading && !error ? (
                        <>
                            <Chip
                                icon={isFinished ? <CheckCircleIcon /> : <PendingIcon />}
                                label={isFinished ? "Fertig" : "Unterwegs"}
                                color={isFinished ? "success" : "info"}
                                size="small"
                                variant="outlined"
                            />
                            {totalStops > 0 && (
                                <Typography variant="caption" sx={{ fontWeight: 'medium' }}>
                                    {completedStops} / {totalStops} Stopps
                                </Typography>
                            )}
                        </>
                    ) : <div /> }
                </Box>
            </CardContent>
        </Card>
    );
};

export default VehicleProgressCard;