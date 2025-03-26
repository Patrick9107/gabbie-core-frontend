import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Box,
    IconButton,
    TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { Product } from "../../domain/Product.ts";

interface Props {
    products: Product[];
    onDelete?: (id: number) => void;
    onEdit?: (id: number) => void;
    onAddClicked?: (product: Product) => void;
    onRemoveButtonClicked?: (product: Product) => void;
    quantities?: { [id: number]: number };
}

function ProductCards({ products, onDelete, onEdit, onAddClicked, onRemoveButtonClicked, quantities }: Props) {
    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {products.map((product) => (
                    <Card
                        key={product.id}
                        onClick={onAddClicked ? () => onAddClicked(product) : undefined}
                        sx={{
                            width: 290,
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
                            title={product.name}
                            sx={{ textAlign: "center", fontWeight: "bold", paddingBottom: 0 }}
                        />
                        <CardMedia
                            component="img"
                            image={product.imageUrl || "placeholder.svg"}
                            sx={{ height: 180, objectFit: "contain", padding: (theme) => theme.spacing(2) }}
                        />

                        { onEdit &&
                            <Box sx={{ textAlign: "center", mt: 1 }}>
                            <div><strong>Preis:</strong> {product.price} €</div>
                            <div><strong>Gewicht:</strong> {product.weight} kg</div>
                            <div><strong>Behälter:</strong> {product.container?.type.toString() || 'Keiner'}</div>
                        </Box>
                        }


                        <CardContent sx={{ display: "flex", gap: 1.25, mt: "auto", justifyContent: "center" }}>
                            {onEdit && (
                                <Button
                                    onClick={(event) => { event.stopPropagation(); onEdit(product.id); }}
                                    variant="contained"
                                    startIcon={<EditIcon />}
                                    sx={{ fontSize: "0.8rem" }}
                                >
                                    Bearbeiten
                                </Button>
                            )}
                            {onDelete && (
                                <Button
                                    onClick={(event) => { event.stopPropagation(); onDelete(product.id); }}
                                    variant="contained"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    sx={{ fontSize: "0.8rem" }}
                                >
                                    Löschen
                                </Button>
                            )}
                            {onAddClicked && onRemoveButtonClicked && (
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <IconButton
                                        size="large"
                                        color="error"
                                        onClick={(event) => { event.stopPropagation(); onRemoveButtonClicked(product); }}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <TextField
                                        size="small"
                                        sx={{ width: "4em", textAlign: "center" }}
                                        type="number"
                                        value={!(quantities) || quantities[product.id] || 0}
                                        onClick={(event) => event.stopPropagation()}
                                        slotProps={{ htmlInput: { readOnly: true } }}
                                    />
                                    <IconButton
                                        size="large"
                                        color="success"
                                        onClick={(event) => { event.stopPropagation(); onAddClicked(product); }}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}

export default ProductCards;
