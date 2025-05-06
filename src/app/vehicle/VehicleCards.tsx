import { Box, Skeleton } from "@mui/material";
import { Vehicle } from "../../domain/Vehicle.ts";
import VehicleCard from "./VehicleCard.tsx";

interface Props {
    vehicles?: Vehicle[];
    onDelete?: (id: number) => void;
    onEdit?: (id: number) => void;
    onShowAddresses?: (routeId: number) => void;
    isLoading: boolean;
}

const SKELETON_COUNT = 4;

function VehicleCards({ vehicles, onDelete, onEdit, onShowAddresses, isLoading }: Props) {
    return (
        <Box sx={{ mt: isLoading ? 0 : 4 }}>
            <Box sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: {
                    xs: 'repeat(auto-fill, minmax(300px, 1fr))',
                    lg: 'repeat(auto-fill, minmax(340px, 1fr))',
                }
            }}>
                {isLoading ? (
                    Array.from(new Array(SKELETON_COUNT)).map((_, index) => (
                        <Box key={index}>
                            <Skeleton variant="text" height={40} width="60%" sx={{mb: 1}}/>
                            <Skeleton variant="rectangular" height={160} />
                            <Skeleton variant="text" sx={{ mt: 1.5 }} />
                            <Skeleton variant="text" width="70%" />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Skeleton variant="rounded" width={100} height={30} />
                            </Box>
                        </Box>
                    ))
                ) : (
                    vehicles?.map((vehicle) => (
                        <VehicleCard
                            key={vehicle.id}
                            vehicle={vehicle}
                            onDelete={onDelete}
                            onEdit={onEdit}
                            onShowAddresses={onShowAddresses}
                        />
                    ))
                )}
            </Box>
        </Box>
    );
}

export default VehicleCards;