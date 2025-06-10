import React, { useEffect, useState } from 'react';
import { Grid, Box, CircularProgress, Alert, Typography } from '@mui/material';
import { Vehicle } from '../../domain/Vehicle'; // Pfad ggf. anpassen
import { API_BASE_URL } from '../../../apiConfig'; // Pfad ggf. anpassen
import VehicleProgressCard from './VehicleProgressCard'; // Import unserer neuen Karten-Komponente

const VehicleContainer: React.FC = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVehicles = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/vehicle`);
                if (!response.ok) {
                    throw new Error(`Fehler beim Laden der Fahrzeuge: ${response.status}`);
                }
                const data: Vehicle[] = await response.json();
                setVehicles(data);
            } catch (err: any) {
                console.error("Fehler im VehicleContainer:", err);
                setError(err.message || "Ein unbekannter Fehler ist aufgetreten.");
            } finally {
                setLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ width: '100%' }}>
                {error}
            </Alert>
        );
    }

    return (
        <Box>
            {vehicles.length > 0 ? (
                <Grid container spacing={3}>
                    {vehicles.map((vehicle) => (
                        // --- ANPASSUNG HIER ---
                        // md={6} -> 2 Karten pro Zeile auf allen Bildschirmen ab der Größe "small"
                        <Grid item key={vehicle.id} xs={12} sm={6} md={6}>
                            <VehicleProgressCard vehicle={vehicle} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                    Keine Fahrzeuge im System gefunden.
                </Typography>
            )}
        </Box>
    );
};

export default VehicleContainer;