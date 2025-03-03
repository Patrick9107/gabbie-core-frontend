import { Button, Card, CardContent, CardHeader, CardMedia, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Vehicle } from "../../domain/Vehicle.ts";

interface Props {
  vehicles: Vehicle[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

function VehicleCards({ vehicles, onDelete, onEdit }: Props) {
  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: theme => theme.spacing(3) }}>
        {vehicles.map((vehicle) => (
          <Card
            key={vehicle.id}
            sx={{
              width: 290,
              height: 250,
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
              boxShadow: 3,
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "scale(1.002)",
                boxShadow: 6,
              },
            }}
          >
            <CardHeader
              title={vehicle.licensePlate}
              subheader={`Kapazität: ${vehicle.capacity}`}
              sx={{ textAlign: "center", fontWeight: "bold" }}
            />
            <CardMedia
              component="img"
              image={"kumbolderkombi.png"} // Fallback auf Standardbild
              sx={{ height: 100, objectFit: "contain", padding: theme => theme.spacing(2) }}
            />
            <CardContent
              sx={{
                display: "flex",
                gap: theme => theme.spacing(1.25),
                mt: "auto",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Button
                onClick={() => onEdit(vehicle.id)}
                variant="contained"
                startIcon={<EditIcon />}
                sx={{ fontSize: "0.8rem" }}
              >
                Bearbeiten
              </Button>
              <Button
                onClick={() => onDelete(vehicle.id)}
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                sx={{ fontSize: "0.8rem" }}
              >
                Löschen
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default VehicleCards;