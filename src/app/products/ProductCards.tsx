import {
    Box,
} from "@mui/material";
import { Product } from "../../domain/Product.ts";
import ProductCard from "./ProductCard.tsx";

interface Props {
    products: Product[];
    onDelete?: (id: number) => void;
    onEdit?: (id: number) => void;
}

function ProductCards({ products, onDelete, onEdit }: Props) {
    return (
        <Box sx={{ mt: 4 }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onDelete={onDelete}
                        onEdit={onEdit}
                    />
                ))}
            </Box>
        </Box>
    );
}

export default ProductCards;
