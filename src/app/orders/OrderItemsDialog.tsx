import { useEffect, useState, useMemo } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
    Chip,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Product } from "../../domain/Product.ts";
import OrderItemCards from "./OrderItemCards.tsx";
import {OrderItem} from "../../domain/OrderItem.ts";

interface Props {
    isProductDialogOpen: boolean;
    onProductDialogClose: () => void;
    products: Product[];
    setOrderItems: (items: OrderItem[]) => void;
    newOrderItems: {product: Product | null, quantity: number}[];
}

const OrderItemsDialog = ({
                              isProductDialogOpen,
                              onProductDialogClose,
                              products,
                              setOrderItems,
                              newOrderItems
                          }: Props) => {

    const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);

    useEffect(() => {
        if (isProductDialogOpen) {
            const validInitialItems = newOrderItems.filter(item => item.product !== null) as OrderItem[];
            setSelectedItems(validInitialItems);
        }
    }, [isProductDialogOpen, newOrderItems]);

    const handleAddOrIncrement = (product: Product) => {
        setSelectedItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item => item.product.id === product.id);
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
    };

    const handleRemoveOrDecrement = (product: Product) => {
        setSelectedItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item => item.product.id === product.id);
            if (existingItemIndex === -1) return prevItems;

            const currentQuantity = prevItems[existingItemIndex].quantity;
            if (currentQuantity > 1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = {
                    ...updatedItems[existingItemIndex],
                    quantity: currentQuantity - 1
                };
                return updatedItems;
            } else {
                return prevItems.filter((_, index) => index !== existingItemIndex);
            }
        });
    };

    const handleRemoveFromSummary = (productId: number) => {
        setSelectedItems(prevItems => prevItems.filter(item => item.product.id !== productId));
    };

    const handleQuantityChange = (quantity: number, product: Product) => {
        const newQuantity = Math.max(0, quantity || 0);
        setSelectedItems(prevItems => {
            const existingItemIndex = prevItems.findIndex(item => item.product.id === product.id);
            if (newQuantity === 0) {
                if (existingItemIndex !== -1) {
                    return prevItems.filter((_, index) => index !== existingItemIndex);
                }
                return prevItems;
            }
            if (existingItemIndex !== -1) {
                const updatedItems = [...prevItems];
                updatedItems[existingItemIndex] = { ...updatedItems[existingItemIndex], quantity: newQuantity };
                return updatedItems;
            } else {
                return [...prevItems, { product, quantity: newQuantity }];
            }
        });
    };

    const totalSum = useMemo(() => {
        return selectedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    }, [selectedItems]);

    const quantitiesMap = useMemo(() => {
        return Object.fromEntries(
            selectedItems.map(item => [item.product.id, item.quantity])
        );
    }, [selectedItems]);

    const handleConfirmAndClose = () => {
        setOrderItems(selectedItems);
        onProductDialogClose();
    };

    const handleCancel = () => {
        onProductDialogClose();
    };

    return (
        <Dialog
            open={isProductDialogOpen}
            onClose={handleCancel}
            maxWidth="lg"
            fullWidth
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
                <ShoppingCartIcon sx={{ mr: 1 }} />
                Produkte auswählen
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0, m: 0, overflow: 'hidden', height: '70vh' }}>
                <Box sx={{
                    display: 'grid',
                    height: '100%',
                    gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' },
                }}>

                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        borderRight: { md: (theme) => `1px solid ${theme.palette.divider}` },
                        overflow: 'hidden'
                    }}>
                        <Box sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Auswahl
                            </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1 }}>
                            {selectedItems.length === 0 ? (
                                <Typography variant="body2" color="textSecondary" sx={{ p: 2, textAlign: 'center' }}>
                                    Keine Produkte ausgewählt.
                                </Typography>
                            ) : (
                                <List dense>
                                    {selectedItems.map((item) => (
                                        <ListItem
                                            key={item.product.id}
                                            secondaryAction={
                                                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFromSummary(item.product.id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            }
                                            sx={{ pr: 5 }}
                                        >
                                            <ListItemText
                                                primary={item.product.name}
                                                secondary={`Preis: ${(item.product.price * item.quantity).toFixed(2)} €`}
                                            />
                                            <Chip label={`x ${item.quantity}`} size="small" sx={{ ml: 1 }}/>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Box>
                        <Divider />
                        <Box sx={{ p: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[100] }}>
                            <Typography variant="h6" align="right">
                                Gesamtsumme: {totalSum.toFixed(2)} €
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ height: '100%', overflowY: 'auto', p: 2 }}>
                        <OrderItemCards
                            products={products}
                            onAddClicked={handleAddOrIncrement}
                            onRemoveButtonClicked={handleRemoveOrDecrement}
                            quantities={quantitiesMap}
                            onQuantityChange={handleQuantityChange}
                        />
                    </Box>

                </Box>
            </DialogContent>
            <DialogActions sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}`, p: '16px 24px' }}>
                <Button onClick={handleCancel} color="inherit">
                    Abbrechen
                </Button>
                <Button onClick={handleConfirmAndClose} variant="contained" color="primary">
                    Auswahl übernehmen
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderItemsDialog;