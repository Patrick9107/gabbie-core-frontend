import {Product} from "../../domain/Product.ts";
import ProductCard from "../products/ProductCard.tsx";
import {Box} from "@mui/material";

interface Props {
    products: Product[];
    onAddClicked: (product: Product) => void;
    onRemoveButtonClicked: (product: Product) => void;
    quantities: { [id: number]: number };
    onQuantityChange: (quantity: number, product: Product) => void;
}

const OrderItemCards = ({products, onAddClicked, onRemoveButtonClicked, quantities, onQuantityChange}: Props) => {
    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {products.map((product) => (
            <ProductCard
                product={product}
                onAddClicked={onAddClicked}
                onRemoveButtonClicked={onRemoveButtonClicked}
                quantities={quantities}
                onQuantityChange={onQuantityChange}
            />
             ))}
        </Box>);
}

export default OrderItemCards;