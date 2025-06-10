import { Box, Skeleton } from "@mui/material";
import { Product } from "../../domain/Product.ts";
import ProductCard from "./ProductCard.tsx";

interface Props {
    products?: Product[];
    onDelete?: (id: number) => void;
    onEdit?: (id: number) => void;
    isLoading: boolean;
}

const SKELETON_COUNT = 8;

function ProductCards({ products, onDelete, onEdit, isLoading }: Props) {
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
                            <Skeleton variant="rectangular" height={180} />
                            <Skeleton variant="text" sx={{ mt: 1 }} />
                            <Skeleton variant="text" width="60%" />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                <Skeleton variant="rounded" width={100} height={36} />
                                <Skeleton variant="rounded" width={100} height={36} />
                            </Box>
                        </Box>
                    ))
                ) : (
                    products?.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onDelete={onDelete}
                            onEdit={onEdit}
                        />
                    ))
                )}
            </Box>
        </Box>
    );
}

export default ProductCards;
