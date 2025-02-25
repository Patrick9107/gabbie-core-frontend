import {
    container1,
    container2,
    container3,
    container4
} from "../../domain/ExampleData.ts";
import ProductCards from "./ProductCards.tsx";
import { Typography } from "@mui/material";
import AddButton from "../../core/ui/AddButton.tsx";
import { ChangeEvent, useEffect, useState } from "react";
import { Product } from "../../domain/Product.ts";
import ProductDialog from "./ProductDialog.tsx";
import DeleteConfirmationDialog from "../../core/ui/DeleteConfirmationDialog.tsx";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../../infra/api/productService.ts";

const defaultProduct = {
    id: -1,
    price: 0,
    weight: 0,
    name: "",
    description: "",
    imageUrl: null,
    container: undefined
}

const containers = [
    container1, container2, container3, container4
];

function ListProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [newProduct, setNewProduct] = useState<Product>(defaultProduct);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);

    // Fetch products on mount
    useEffect(() => {
        fetchProducts().then(setProducts).catch(console.error);
    }, []);

    const handleClose = () => {
        setOpen(false);
        setEdit(false);
        setNewProduct(defaultProduct);
    }

    const handleSubmit = async () => {
        try {
            let updatedProduct: Product;

            if (edit) {
                updatedProduct = await updateProduct(newProduct);
                setProducts((prevProducts) => prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p));
            } else {
                updatedProduct = await createProduct(newProduct);
                setProducts((prevProducts) => [...prevProducts, updatedProduct]);
            }

            handleClose();
        } catch (error) {
            console.error(error);
        }
    }

    const handleContainerChange = (containerId: number | null) => {
        const foundContainer = containers.find(c => c.id === containerId) ?? null;
        setNewProduct({ ...newProduct, container: foundContainer });
    };

    const handleAdd = () => {
        setOpen(true);
    }

    const handleDeleteButtonClicked = (id: number) => {
        setDeleteConfirm(true);
        setProductToDelete(id);
    }

    const handleDelete = async () => {
        if (productToDelete) {
            try {
                await deleteProduct(productToDelete);
                setProducts((prevProducts) => prevProducts.filter(o => o.id !== productToDelete));
            } catch (error) {
                console.error(error);
            }
            setDeleteConfirm(false);
            setProductToDelete(null);
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleEdit = (id: number) => {
        const editableProduct = products.find((product) => product.id === id);
        if (editableProduct) {
            setNewProduct(editableProduct);
        } else {
            console.error("Product not found!");
        }
        setEdit(true);
        setOpen(true);
    }

    return (
      <>
          <Typography sx={{ fontWeight: "bold" }} variant="h4" gutterBottom> Produktübersicht </Typography>
          <AddButton onClick={handleAdd}/>
          <ProductCards products={products} onDelete={handleDeleteButtonClicked} onEdit={handleEdit}/>

          <ProductDialog
            open={isOpen}
            edit={edit}
            product={newProduct}
            onClose={handleClose}
            onSubmit={handleSubmit}
            onChange={handleChange}
            containers={containers}
            onContainerChange={handleContainerChange}
          />

          <DeleteConfirmationDialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)} onConfirm={handleDelete}/>
      </>
    );
}

export default ListProducts;