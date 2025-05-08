import AddButton from "../../core/ui/AddButton.tsx";
import { ChangeEvent, useEffect, useState, useCallback } from "react";
import { Product } from "../../domain/Product.ts";
import { fetchOrders, deleteOrder, createOrder, updateOrder } from "../../infra/api/orderService.ts";
import { Dayjs } from "dayjs";
import DeleteConfirmationDialog from "../../core/ui/DeleteConfirmationDialog.tsx";
import OrderTable from "./OrderTable.tsx";
import OrderDialog from "./OrderDialog.tsx";
import { Typography, Box, CircularProgress, Alert, Snackbar, Stack } from "@mui/material";
import { OrderResponse } from "../../domain/OrderResponse.ts";
import { OrderItem } from "../../domain/OrderItem.ts";
import { fetchProducts } from "../../infra/api/productService.ts";
import OrderOverview from './OrderOverview.tsx';

const defaultOrder: OrderResponse = {
    id: -1,
    deliveryDate: null,
    address: "",
    phoneNumber: "",
    orderItems: [],
    orderStatus: 1,
    note: "",
    orderSource: 1,
    deliveryWindowStartDate: null,
    deliveryWindowEndDate: null,
    totalAmount: 0,
    createdAt: null,
    updatedAt: null,
};

function ListOrders() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [newOrderProducts, setNewOrderProducts] = useState<{ product: Product | null; quantity: number }[]>([]);
    const [newOrder, setNewOrder] = useState<OrderResponse>(defaultOrder);
    const [edit, setEdit] = useState<boolean>(false);
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
    const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
    const [selectedOrderSource, setSelectedOrderSource] = useState<number | null>(null);
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
    const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' } | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setApiError(null);
        try {
            const [fetchedOrders, fetchedProducts] = await Promise.all([
                fetchOrders(),
                fetchProducts()
            ]);
            setOrders(fetchedOrders);
            setAvailableProducts(fetchedProducts);
        } catch (error: any) {
            console.error("Failed to fetch data:", error);
            const errorMsg = error.message || "Daten konnten nicht geladen werden.";
            setApiError(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
        document.title = "Bestellungen";
    }, [loadData]);

    const handleOpenProductDialog = () => {
        setIsProductDialogOpen(true);
    };

    const handleSetOrderItems = (items: { product: Product | null; quantity: number }[]) => {
        setNewOrderProducts(items);
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
    };

    const handleDateChange = (e: Dayjs | null) => {
        setNewOrder({ ...newOrder, deliveryDate: e ? e.toDate() : null });
    };

    const resetDialogState = () => {
        setIsOpen(false);
        setEdit(false);
        setNewOrder(defaultOrder);
        setSelectedOrderSource(null);
        setNewOrderProducts([]);
        setApiError(null);
    }

    const handleSubmit = async () => {
        setApiError(null);

        const mappedOrderItems = newOrderProducts
            .filter(value => value !== null)
            .map(value => ({
                product: value.product,
                quantity: value.quantity
            }));

        const updatedOrder = {
            ...newOrder,
            orderItems: mappedOrderItems as unknown as OrderItem[],
            orderSource: selectedOrderSource ?? 0
        }

        try {
            let response: OrderResponse;
            if (edit) {
                response = await updateOrder(updatedOrder);
                setOrders(prevState =>
                    prevState.map(order => order.id === response.id ? response : order)
                );
                setSnackbar({ open: true, message: "Bestellung erfolgreich aktualisiert!", severity: 'success'});
            } else {
                response = await createOrder(updatedOrder);
                setOrders(prevState => [...prevState, response]);
                setSnackbar({ open: true, message: "Bestellung erfolgreich erstellt!", severity: 'success'});
            }
            resetDialogState();
        } catch (error: any) {
            console.error("Fehler beim Speichern der Bestellung:", error);
            const errorMsg = error.message || "Bestellung konnte nicht gespeichert werden.";
            setApiError(errorMsg);
            setSnackbar({ open: true, message: errorMsg, severity: 'error' });
        }
    }

    const handleCancel = () => {
        resetDialogState();
    }

    const handleOrderSourceChange = (id: number | null) => {
        setSelectedOrderSource(id);
    }

    const handleEditButtonClicked = (id: number) => {
        const order = orders.find(order => order.id === id);
        if (order) {
            setNewOrder(order);
            const dialogOrderItems = order.orderItems.map(item => ({
                product: availableProducts.find(p => p.id === item.product.id) ?? null,
                quantity: item.quantity
            })).filter(item => item.product !== null);

            setNewOrderProducts(dialogOrderItems);
            setSelectedOrderSource(order.orderSource ?? null);
            setEdit(true);
            setIsOpen(true);
            setApiError(null);
        } else {
            console.error("Order not found for editing:", id);
            setSnackbar({ open: true, message: "Die zu bearbeitende Bestellung wurde nicht gefunden.", severity: 'error'});
        }
    }

    const handleDelete = async () => {
        if (orderToDelete !== null) {
            setApiError(null);
            try {
                await deleteOrder(orderToDelete);
                setOrders(prevState => prevState.filter(o => o.id !== orderToDelete));
                setSnackbar({ open: true, message: "Bestellung erfolgreich gelöscht!", severity: 'success'});
            } catch (error: any) {
                console.error("Fehler beim Löschen der Bestellung:", error);
                const errorMsg = error.message || "Bestellung konnte nicht gelöscht werden.";
                setApiError(errorMsg);
                setSnackbar({ open: true, message: errorMsg, severity: 'error' });
            } finally {
                setDeleteConfirm(false);
                setOrderToDelete(null);
            }
        }
    }

    const handleDeleteButtonClicked = (id: number) => {
        setDeleteConfirm(true);
        setOrderToDelete(id);
    }

    const handleCloseSnackbar = () => {
        setSnackbar(null);
    };

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <OrderOverview orders={orders} sxCustom={{ mb: 3 }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} spacing={2}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    Bestellübersicht
                </Typography>
                <AddButton onClick={() => { resetDialogState(); setIsOpen(true); }} />
            </Stack>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                    <CircularProgress />
                </Box>
            ) : apiError && orders.length === 0 ? (
                <Alert severity="error" sx={{ my: 2 }}>{apiError}</Alert>
            ) : (
                <OrderTable
                    orders={orders}
                    onEdit={handleEditButtonClicked}
                    onDelete={handleDeleteButtonClicked}
                />
            )}

            <OrderDialog
                open={isOpen}
                edit={edit}
                isProductDialogOpen={isProductDialogOpen}
                onProductDialogClose={() => setIsProductDialogOpen(false)}
                order={newOrder}
                products={availableProducts}
                onClose={handleCancel}
                onSubmit={handleSubmit}
                onChange={handleChange}
                onDateChange={handleDateChange}
                onOrderSourceChange={handleOrderSourceChange}
                selectedOrderSource={selectedOrderSource}
                onManageProductsClick={handleOpenProductDialog}
                setOrderItems={handleSetOrderItems}
                newOrderItems={newOrderProducts}
                apiError={apiError}
                clearApiError={() => setApiError(null)}
            />

            <DeleteConfirmationDialog
                open={deleteConfirm}
                onClose={() => setDeleteConfirm(false)}
                onConfirm={handleDelete}
            />

            {snackbar && (
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    );
}

export default ListOrders;