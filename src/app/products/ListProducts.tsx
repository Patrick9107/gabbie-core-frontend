import { ChangeEvent, useEffect, useState, useCallback, lazy, Suspense } from "react";
import { Product } from "../../domain/Product.ts";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../../infra/api/productService.ts";
import { fetchContainers } from '../../infra/api/containerService.ts';
import { Container } from '../../domain/Container.ts';
import { Typography, Box, Alert, Snackbar, Stack, Button, CircularProgress } from "@mui/material";

const AddButton = lazy(() => import("../../core/ui/AddButton.tsx"));
const ProductDialog = lazy(() => import("./ProductDialog.tsx"));
const DeleteConfirmationDialog = lazy(() => import("../../core/ui/DeleteConfirmationDialog.tsx"));
const ProductCards = lazy(() => import("./ProductCards.tsx"));

const defaultProduct: Product = {
    id: -1,
    price: 0,
    weight: 0,
    name: "",
    description: "",
    imageUrl: "",
    container: undefined
};

function ListProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [containers, setContainers] = useState<Container[]>([]);
    const [newProduct, setNewProduct] = useState<Product>(defaultProduct);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' } | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setApiError(null);
        try {
            const [fetchedProducts, fetchedContainers] = await Promise.all([
                fetchProducts(),
                fetchContainers()
            ]);
            setProducts(fetchedProducts);
            setContainers(fetchedContainers);
        } catch (err: any) {
            console.error("Fehler beim Laden der Daten:", err);
            const errorMsg = err.message || "Daten konnten nicht geladen werden.";
            setApiError(errorMsg);
            setSnackbar({ open: true, message: errorMsg, severity: 'error' });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
        document.title = "Produkte";
    }, [loadData]);

    const handleCloseSnackbar = () => {
        setSnackbar(null);
    };

    const resetDialogState = () => {
        setOpen(false);
        setEdit(false);
        setNewProduct(defaultProduct);
        setApiError(null);
    }

    const handleSubmit = async () => {
        setApiError(null);
        try {
            let responseProduct: Product;
            if (edit) {
                responseProduct = await updateProduct(newProduct);
                setProducts((prevProducts) => prevProducts.map(p => p.id === responseProduct.id ? responseProduct : p));
                setSnackbar({ open: true, message: 'Produkt erfolgreich aktualisiert!', severity: 'success' });
            } else {
                responseProduct = await createProduct(newProduct);
                setProducts((prevProducts) => [...prevProducts, responseProduct]);
                setSnackbar({ open: true, message: 'Produkt erfolgreich erstellt!', severity: 'success' });
            }
            resetDialogState();
        } catch (error: any) {
            console.error("Fehler beim Speichern des Produkts:", error);
            const errorMsg = error.message || "Produkt konnte nicht gespeichert werden.";
            setApiError(errorMsg);
            setSnackbar({ open: true, message: errorMsg, severity: 'error' });
        }
    };

    const handleContainerChange = (containerId: number | null) => {
        const foundContainer = containers.find(c => c.id === containerId) ?? undefined;
        setNewProduct({ ...newProduct, container: foundContainer });
    };

    const handleAdd = () => {
        resetDialogState();
        setOpen(true);
    };

    const handleDeleteButtonClicked = (id: number) => {
        setDeleteConfirm(true);
        setProductToDelete(id);
    };

    const handleDelete = async () => {
        if (productToDelete !== null) {
            setApiError(null);
            try {
                await deleteProduct(productToDelete);
                setProducts((prevProducts) => prevProducts.filter(p => p.id !== productToDelete));
                setSnackbar({ open: true, message: 'Produkt erfolgreich gelöscht!', severity: 'success' });
            } catch (error: any) {
                console.error("Fehler beim Löschen des Produkts:", error);
                const errorMsg = error.message || "Produkt konnte nicht gelöscht werden.";
                setApiError(errorMsg);
                setSnackbar({ open: true, message: errorMsg, severity: 'error' });
            } finally {
                setDeleteConfirm(false);
                setProductToDelete(null);
            }
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newValue = (name === 'price' || name === 'weight') ? parseFloat(value) || '' : value;
        setNewProduct({ ...newProduct, [name]: newValue });
    };

    const handleEdit = (id: number) => {
        const editableProduct = products.find((product) => product.id === id);
        if (editableProduct) {
            setNewProduct(editableProduct);
            setEdit(true);
            setOpen(true);
            setApiError(null);
        } else {
            console.error("Product not found!");
            const errorMsg = "Das zu bearbeitende Produkt wurde nicht gefunden.";
            setApiError(errorMsg);
            setSnackbar({ open: true, message: errorMsg, severity: 'error' });
        }
    };

    const LoadingFallback = () => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <Suspense fallback={<LoadingFallback />}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} spacing={2}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                        Produktverwaltung
                    </Typography>
                    <AddButton onClick={handleAdd} />
                </Stack>

                {loading ? (
                    <ProductCards isLoading={true} />
                ) : apiError && products.length === 0 ? (
                    <Alert severity="error" sx={{ my: 2 }}>{apiError}</Alert>
                ) : !loading && products.length === 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 6, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Noch keine Produkte angelegt.
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                            Fügen Sie Ihr erstes Produkt hinzu, um es hier zu sehen.
                        </Typography>
                        <Button variant="contained" onClick={handleAdd}>
                            Erstes Produkt hinzufügen
                        </Button>
                    </Box>
                ) : (
                    <ProductCards products={products} onDelete={handleDeleteButtonClicked} onEdit={handleEdit} isLoading={false}/>
                )}

                <ProductDialog
                    open={isOpen}
                    edit={edit}
                    product={newProduct}
                    onClose={resetDialogState}
                    onSubmit={handleSubmit}
                    onChange={handleChange}
                    containers={containers}
                    onContainerChange={handleContainerChange}
                    apiError={apiError}
                    clearApiError={() => setApiError(null)}
                />

                <DeleteConfirmationDialog
                    open={deleteConfirm}
                    onClose={() => setDeleteConfirm(false)}
                    onConfirm={handleDelete}
                />
            </Suspense>

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

export default ListProducts;