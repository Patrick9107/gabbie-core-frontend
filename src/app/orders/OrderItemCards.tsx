import { Product } from "../../domain/Product.ts";
import OrderItemCard from "./OrderItemCard.tsx";
import { Box, Skeleton } from "@mui/material";

interface Props {
    products: Product[];
    onAddClicked: (product: Product) => void;
    onRemoveButtonClicked: (product: Product) => void;
    quantities: { [id: number]: number };
    onQuantityChange: (quantity: number, product: Product) => void;
    isLoading?: boolean;
}

const SKELETON_COUNT = 8;

const OrderItemCards = ({
                            products,
                            onAddClicked,
                            onRemoveButtonClicked,
                            quantities,
                            onQuantityChange,
                            isLoading = false
                        }: Props) => {
    return (
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
                        <Skeleton variant="rectangular" height={160} />
                        <Skeleton variant="text" sx={{ mt: 1.5 }} width="80%" />
                        <Skeleton variant="text" width="40%" />
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <Skeleton variant="circular" width={24} height={24} sx={{ mx: 0.5 }} />
                            <Skeleton variant="rounded" width={60} height={30} sx={{ mx: 0.5 }}/>
                            <Skeleton variant="circular" width={24} height={24} sx={{ mx: 0.5 }}/>
                        </Box>
                    </Box>
                ))
            ) : (
                products.map((product) => (
                    <OrderItemCard
                        key={product.id}
                        product={product}
                        quantity={quantities[product.id] ?? 0}
                        onAddClicked={onAddClicked}
                        onRemoveButtonClicked={onRemoveButtonClicked}
                        onQuantityChange={onQuantityChange}
                    />
                ))
            )}
        </Box>
    );
}

export default OrderItemCards;