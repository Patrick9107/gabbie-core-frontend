import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Typography,
    Container,
    Box,
    Button,
} from "@mui/material";

interface Vehicle {
    id: number;
    image: string;
    name: string;
    load: number;
    capacity: number;
}

const VehicleList = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);

    useEffect(() => {
        // Dummy-Daten statt API-Aufruf ∫ hatte die Datenbank noch nicht aber sollte funktioniern ~LG Marko :-)
        setVehicles([
            { id: 1, image: "/kumbolderkombi.png", name: "Fahrzeug 1", load: 340, capacity: 1500 },
            { id: 2, image: "/kumbolderkombi.png", name: "Fahrzeug 2", load: 420, capacity: 1600 },
            { id: 3, image: "/kumbolderkombi.png", name: "Fahrzeug 3", load: 500, capacity: 1800 },

        ]);
    }, []);

    return (
        <Container
            sx={{
                padding: 4,
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                display="grid"
                gridTemplateColumns={{
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                }}
                gap={4}
                sx={{ maxWidth: "80%", margin: "auto" }}
            >
                {vehicles.map((vehicle) => (
                    <Card key={vehicle.id} sx={{ textAlign: "center", padding: 2 }}>
                        <CardMedia
                            component="img"
                            image={vehicle.image}
                            alt={vehicle.name}
                            sx={{ maxWidth: "100%", margin: "auto" }}
                        />
                        <CardContent>
                            <Typography variant="h6" component="div">
                                {vehicle.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {vehicle.load} / {vehicle.capacity} kg
                            </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: "center" }}>
                            <Button
                                onClick={() =>
                                    console.log(`Ladeliste für ${vehicle.name} anzeigen`)
                                }
                                variant="contained"
                                sx={{
                                    backgroundColor: "#16a34a",
                                    color: "white",
                                    borderRadius: "20px",
                                    padding: "8px 16px",
                                    "&:hover": {
                                        backgroundColor: "#128a3b",
                                    },
                                }}
                            >
                                Ladeliste anzeigen
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </Box>
        </Container>
    );
};

export default VehicleList;