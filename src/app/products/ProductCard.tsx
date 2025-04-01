import {Box, Button, Card, CardContent, CardHeader, CardMedia, IconButton, TextField} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import {Product} from "../../domain/Product.ts";

interface Props {
    product: Product;
    onDelete?: (id: number) => void;
    onEdit?: (id: number) => void;
    onAddClicked?: (product: Product) => void;
    onRemoveButtonClicked?: (product: Product) => void;
    quantities?: { [id: number]: number };
    onQuantityChange?: (quantity: number, product: Product) => void;
}

const ProductCard = ({product, onDelete, onEdit, onAddClicked, onRemoveButtonClicked, quantities, onQuantityChange}: Props) => {
    
    const productView = !!onDelete && !!onEdit;

    const cardWidth =  productView ? 290 : 185;
    
    return <Card
        key={product.id}
        onClick={onAddClicked ? () => onAddClicked(product) : undefined}
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
            title={product.name}
            sx={{ textAlign: "center", fontWeight: "bold", paddingBottom: 0 }}
        />
        <CardMedia
            component="img"
            image={product.imageUrl || "placeholder.svg"}
            sx={{ height: 180, objectFit: "contain", padding: (theme) => theme.spacing(2) }}
        />

        { productView &&
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
            {!productView && onRemoveButtonClicked && onAddClicked && (
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
                        type="text"
                        value={quantities?.[product.id] !== undefined ? quantities[product.id] : "0"}
                        onClick={(event) => event.stopPropagation()}
                        onFocus={(event) => {
                            if (event.target.value === "0") {
                                event.target.value = "";
                            }
                        }}
                        onBlur={(event) => {
                            if (event.target.value === "") {
                                event.target.value = "0";
                            }
                        }}
                        onChange={(event) => {
                            const inputValue = event.target.value.trim();

                            if (/^-?\d*$/.test(inputValue)) {
                                const newQuantity = parseInt(inputValue, 10) || 0;
                                if (onQuantityChange) {
                                    onQuantityChange(newQuantity, product);
                                }
                            }
                        }}
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
}

export default ProductCard;