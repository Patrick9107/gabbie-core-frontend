import {
    Box,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Typography,
    Stack,
    Tooltip,
    IconButton,
    Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Vehicle } from "../../domain/Vehicle.ts";
import { useTheme } from '@mui/material/styles';
import React from "react";

interface Props {
    vehicle: Vehicle;
    onDelete?: (id: number) => void;
    onEdit?: (id: number) => void;
    onShowAddresses?: (routeId: number) => void;
}

const VehicleCard = ({ vehicle, onDelete, onEdit, onShowAddresses }: Props) => {
    const theme = useTheme();

    const handleEditClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onEdit?.(vehicle.id);
    };

    const handleDeleteClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onDelete?.(vehicle.id);
    };

    const handleShowAddressesClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        if (vehicle.routeId) { // Ensure routeId exists
            onShowAddresses?.(vehicle.routeId);
        }
    };

    return (
        <Card
            elevation={2}
            sx={{
                display: "flex",
                flexDirection: "column",
                height: '100%',
                borderRadius: theme.shape.borderRadius * 1.5,
                transition: "box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out",
                '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                    '& .vehicle-card-actions': {
                        opacity: 1,
                    }
                }
            }}
        >
            <CardHeader
                title={
                    <Typography variant="h6" component="div" noWrap sx={{ fontWeight: 'medium' }}>
                        {vehicle.licensePlate || 'Unbekanntes Kennzeichen'}
                    </Typography>
                }
                action={
                    <Box className="vehicle-card-actions" sx={{ opacity: { xs: 1, md: 0 }, transition: 'opacity 0.2s' }}>
                        <Tooltip title="Bearbeiten">
                            <IconButton size="small" onClick={handleEditClick}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Löschen">
                            <IconButton size="small" onClick={handleDeleteClick}>
                                <DeleteIcon color="error" fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                }
                sx={{ pb: 0 }}
            />
            <CardMedia
                sx={{
                    height: 160,
                    objectFit: "contain",
                    p: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: theme.palette.grey[100],
                }}
            >
                    <Box
                        component="img"
                        src={"kumbolderkombi.png"}
                        alt={vehicle.licensePlate}
                        sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
            </CardMedia>

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                    <Typography variant="body1" color="text.primary">
                        Kapazität: {vehicle.capacity}
                    </Typography>
                </Stack>

                {vehicle.routeId > 0 && onShowAddresses && (
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={handleShowAddressesClick}
                        sx={{ mt: 'auto', alignSelf: 'flex-start' }}
                    >
                        Adressen anzeigen
                    </Button>
                )}
                {!(vehicle.routeId > 0 && onShowAddresses) && <Box sx={{mt: 'auto'}} />}

            </CardContent>
        </Card>
    );
};

export default VehicleCard;