import { Box, Skeleton } from "@mui/material";
import { Vehicle } from "../../domain/Vehicle.ts";
import VehicleCard from "./VehicleCard.tsx"; // Import the new component

interface Props {
    vehicles?: Vehicle[]; // Optional for loading state
    onDelete?: (id: number) => void;
    onEdit?: (id: number) => void;
    onShowAddresses?: (routeId: number) => void; // Pass down callback
    isLoading: boolean; // Add isLoading prop
}

const SKELETON_COUNT = 4; // Adjust as needed

function VehicleCards({ vehicles, onDelete, onEdit, onShowAddresses, isLoading }: Props) {
    return (
        <Box sx={{ mt: isLoading ? 0 : 4 }}> {/* Consistent margin */}
            <Box sx={{
                display: 'grid', // Use grid
                gap: 3,
                gridTemplateColumns: { // Responsive grid, maybe wider cards for vehicles?
                    xs: 'repeat(auto-fill, minmax(300px, 1fr))', // Adjust minmax as needed
                    lg: 'repeat(auto-fill, minmax(340px, 1fr))',
                }
            }}>
                {isLoading ? (
                    Array.from(new Array(SKELETON_COUNT)).map((_, index) => (
                        // Skeleton structure mimicking VehicleCard
                        <Box key={index}>
                            <Skeleton variant="text" height={40} width="60%" sx={{mb: 1}}/>
                            <Skeleton variant="rectangular" height={160} />
                            <Skeleton variant="text" sx={{ mt: 1.5 }} />
                            <Skeleton variant="text" width="70%" />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Skeleton variant="rounded" width={100} height={30} />
                                {/* Maybe skeleton for address button? Optional */}
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
                            onShowAddresses={onShowAddresses} // Pass down handler
                        />
                    ))
                )}
            </Box>
            {/* AddressDialog is removed from here, will be managed by VehicleList */}
        </Box>
    );
}

export default VehicleCards;