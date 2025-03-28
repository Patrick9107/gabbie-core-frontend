import {useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Box,
    Typography,
    Divider, Table, TableHead, TableBody, TableRow, TableCell
} from "@mui/material";
import ProductCards from "../products/ProductCards.tsx";
import { Product } from "../../domain/Product.ts";

interface Props {
    isProductDialogOpen: boolean;
    onProductDialogClose: () => void;
    products: Product[];
    setOrderItems: (items: { product: Product | null; quantity: number }[]) => void;
    newOrderItems: { product: Product | null; quantity: number }[];
}

const OrderItemsDialog = ({ isProductDialogOpen, onProductDialogClose, products, setOrderItems, newOrderItems }: Props) => {

    const [selectedOrderItems, setSelectedOrderItems] = useState<{ product: Product | null; quantity: number }[]>(newOrderItems);

    useEffect(() => {
        setOrderItems(selectedOrderItems);
    }, [selectedOrderItems, setOrderItems]);

    const handleAddButtonClicked = (product: Product) => {
        setSelectedOrderItems(prevItems => {

            const existingItemIndex = prevItems.findIndex(item => item.product?.id === product.id);

            if (existingItemIndex !== -1) {

                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity + 1
                };
                return updatedItems;
            } else {

                return [...prevItems, { product, quantity: 1 }];
            }
        });
    }

    const handleRemoveButtonClicked = (product: Product) => {
        setSelectedOrderItems(prevItems => {

            const existingItemIndex = prevItems.findIndex(item => item.product?.id === product.id);


            if (existingItemIndex === -1) {
                return prevItems;
            }


            const updatedItems = [...prevItems];


            if (updatedItems[existingItemIndex].quantity > 1) {
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: updatedItems[existingItemIndex].quantity - 1
                };
                return updatedItems;
            }


            return updatedItems.filter((_, index) => index !== existingItemIndex);
        });
    }

    return (
        <Dialog
            maxWidth="xl"
            sx={{ '& .MuiDialog-paper': { height: '600px' } }}
            open={isProductDialogOpen}
            onClose={onProductDialogClose}
        >
            <DialogContent>

                <Box sx={{
                    display: 'flex',
                    width: '100%',
                    height: '500px'
                }}>
                    <Box sx={{
                        flex: 1,
                        pl: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'auto'
                    }}>
                        <Typography variant="h5">
                            Übersicht
                        </Typography>
                        { selectedOrderItems.length > 0 &&
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell> Produktname </TableCell>
                                        <TableCell> Menge </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {selectedOrderItems.map(value => (
                                        <TableRow key={"" + value?.product?.id + value.quantity}>
                                            <TableCell>{value?.product?.name}</TableCell>
                                            <TableCell>{value?.quantity}</TableCell>
                                        </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        }
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box sx={{
                        flex: 3,
                        overflow: 'auto',
                        pr: 2
                    }}>
                        <ProductCards
                            products={products}
                            onAddClicked={handleAddButtonClicked}
                            onRemoveButtonClicked={handleRemoveButtonClicked}
                            quantities={Object.fromEntries(selectedOrderItems.map(item => [item.product?.id, item.quantity]))}
                        />
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onProductDialogClose} color="secondary">
                    Zurück
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default OrderItemsDialog;