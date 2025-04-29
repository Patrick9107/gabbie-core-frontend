import {
    Box,
} from "@mui/material";
import { Container } from "../../domain/Container.ts";
import ContainerCard from "./ContainerCard.tsx";

interface Props {
    containers: Container[];
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
}

function ContainerCards({ containers, onDelete, onEdit }: Props) {
    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {containers.map((container) => (
                    <ContainerCard
                        key={container.id}
                        container={container}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                ))}
            </Box>
        </Box>
    );
}

export default ContainerCards;
