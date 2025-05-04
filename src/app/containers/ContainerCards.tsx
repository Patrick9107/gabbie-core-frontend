import { Box, Skeleton } from "@mui/material";
import { Container } from "../../domain/Container.ts";
import ContainerCard from "./ContainerCard.tsx";

interface Props {
    containers?: Container[];
    onDelete?: (id: number) => void;
    onEdit?: (id: number) => void;
    isLoading: boolean;
}

const SKELETON_COUNT = 6;

function ContainerCards({ containers, onDelete, onEdit, isLoading }: Props) {
    return (
        <Box sx={{ mt: isLoading ? 0 : 4 }}>
            <Box sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: {
                    xs: 'repeat(auto-fill, minmax(260px, 1fr))',
                }
            }}>
                {isLoading ? (
                    Array.from(new Array(SKELETON_COUNT)).map((_, index) => (
                        <Box key={index}>
                            <Skeleton variant="text" height={40} width="80%" sx={{mb: 1}}/>
                            <Skeleton variant="rectangular" height={60} />
                            <Skeleton variant="text" height={30} width="50%" sx={{mt: 1}}/>
                        </Box>
                    ))
                ) : (
                    containers?.map((container) => (
                        <ContainerCard
                            key={container.id}
                            container={container}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    ))
                )}
            </Box>
        </Box>
    );
}

export default ContainerCards;