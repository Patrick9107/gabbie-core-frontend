import {Box, Button, Card, CardContent, CardHeader} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {Container} from "../../domain/Container.ts";

interface Props {
    container: Container;
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
}

const ContainerCard = ({container, onDelete, onEdit}: Props) => {

    const cardWidth =  290;

    return <Card
        key={container.id}
        sx={{
            width: cardWidth,
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
            title={container.type}
            sx={{ textAlign: "center", fontWeight: "bold", paddingBottom: 0 }}
        />

            <Box sx={{ textAlign: "center", mt: 1 }}>
                <div><strong>Pfandpreis:</strong> {container.depositAmount} €</div>
            </Box>


        <CardContent sx={{ display: "flex", gap: 1.25, mt: "auto", justifyContent: "center" }}>
                <Button
                    onClick={(event) => { event.stopPropagation(); onEdit(container.id); }}
                    variant="contained"
                    startIcon={<EditIcon />}
                    sx={{ fontSize: "0.8rem" }}
                >
                    Bearbeiten
                </Button>
                <Button
                    onClick={(event) => { event.stopPropagation(); onDelete(container.id); }}
                    variant="contained"
                    color="error"
                    startIcon={<DeleteIcon />}
                    sx={{ fontSize: "0.8rem" }}
                >
                    Löschen
                </Button>
        </CardContent>
    </Card>
}

export default ContainerCard;