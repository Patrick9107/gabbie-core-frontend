import {
    container1,
    container2,
    container3,
    container4,
    product1,
    product2,
    product3,
    product4
} from "../../domain/ExampleData.ts";
import ProductCards from "./ProductCards.tsx";
import {Typography} from "@mui/material";
import AddButton from "../../core/ui/AddButton.tsx";
import {ChangeEvent, useState} from "react";
import {Product} from "../../domain/Product.ts";
import ProductDialog from "./ProductDialog.tsx";
import DeleteConfirmationDialog from "../../core/ui/DeleteConfirmationDialog.tsx";


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

    const [products, setProducts] = useState<Product[]>([
        product1, product2, product3, product4
    ]);
    const [isOpen, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [newProduct, setNewProduct] = useState<Product>(defaultProduct);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>();

    const handleClose = () => {
        setOpen(false);
        setEdit(false);
        setNewProduct(defaultProduct);
    }

    const handleSubmit = () => {
        let updatedProduct = newProduct;
        if (newProduct.id === -1) {
            updatedProduct = { ...newProduct, id: Math.max(...products.map(p => p.id), 0) + 1 };
        }

        setProducts((prevProducts) => {
            if (edit) {
                return prevProducts.map(o => o.id === updatedProduct.id ? updatedProduct : o); // Aktualisiert Bestellung an derselben Position
            }
            return [...prevProducts, updatedProduct];
        });

        setOpen(false);
        setEdit(false);
        setNewProduct(defaultProduct);
    }

    const handleContainerChange = (containerId: number | null) => {
        const foundContainer = containers.find(c => c.id === containerId) ?? null;
        setNewProduct({...newProduct, container: foundContainer});
    };

    const handleAdd = () => {
        setOpen(true);
    }

    const handleDeleteButtonClicked = (id: number) => {
        setDeleteConfirm(true);
        setProductToDelete(id);
    }

    const handleDelete = () => {
        if (productToDelete) {
            setProducts(products.filter(o => o.id !== productToDelete));
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
