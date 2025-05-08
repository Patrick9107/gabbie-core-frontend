import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
} from "@mui/material";
import { Container } from "../../domain/Container.ts";
import { useTheme } from '@mui/material/styles';
import React from "react";
import SmallIconButton from "../../core/ui/SmallIconButton.tsx";

interface Props {
    container: Container;
    onDelete?: (id: number) => void;
    onEdit?: (id: number) => void;
}

const ContainerCard = ({ container, onDelete, onEdit }: Props) => {
    const theme = useTheme();

    const handleEditClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onEdit?.(container.id);
    };

    const handleDeleteClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onDelete?.(container.id);
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
                    '& .container-card-actions': {
                        opacity: 1,
                    }
                }
            }}
        >
            <CardHeader
                title={
                    <Typography variant="h6" component="div" noWrap sx={{ fontWeight: 'medium' }}>
                        {container.type || 'Unbenannter Behälter'}
                    </Typography>
                }
                action={
                    <Box className="container-card-actions" sx={{ opacity: { xs: 1, md: 0 }, transition: 'opacity 0.2s' }}>
                        <SmallIconButton onClick={handleEditClick} toolTip={"Bearbeiten"} />
                        <SmallIconButton onClick={handleDeleteClick} toolTip={"Löschen"} color={"error"} />
                    </Box>
                }
                sx={{ pb: 0 }}
            />
            <CardContent sx={{ flexGrow: 1, pt: 1.5 }}>
                <Typography variant="body1" color="text.primary">
                    Pfand: {(container.depositAmount ?? 0).toFixed(2)} €
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ContainerCard;