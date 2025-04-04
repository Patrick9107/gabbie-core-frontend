import AddButton from "../../core/ui/AddButton.tsx";
import {ChangeEvent, useEffect, useState} from "react";
import { Product } from "../../domain/Product.ts";
import {fetchOrders, deleteOrder, createOrder, updateOrder} from "../../infra/api/orderService.ts";
import {Dayjs} from "dayjs";
import DeleteConfirmationDialog from "../../core/ui/DeleteConfirmationDialog.tsx";
import OrderTable from "./OrderTable.tsx";
import OrderDialog from "./OrderDialog.tsx";
import {Typography} from "@mui/material";
import {OrderResponse} from "../../domain/OrderResponse.ts";
import {OrderItem} from "../../domain/OrderItem.ts";
import {fetchProducts} from "../../infra/api/productService.ts";
import * as console from "node:console";
import styles from './Order.module.css';


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
}

/* todo
// grundsätzlich funktioniert die api aber es sind noch einige dinge zu tun:
// Ein paar felder dürfen nicht leer gelassen werden (z.b. telefonnummer, 1 produkt muss mindestens hinzugefügt werden, etc., edit: bzw. dürfen sie schon leergelassen werden aber wenn was fehlt sollte ja irgendwie es orange oder so markiert werden)
// wenn error kommt sollte er irgendwo anders als in der konsole ersichtlich sein
*/

function ListOrders() {

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const fetchedOrders = await fetchOrders();
                setOrders(fetchedOrders);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        };

        const loadProducts = async () => {
            try {
                const fetchedProducts = await fetchProducts();
                setAvailableProducts(fetchedProducts);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        }

        loadOrders();
        loadProducts();
        document.title = "Bestellungen";
    }, []);


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

    const handleOpenProductDialog = () => {
        setIsProductDialogOpen(true);
    };

    const handleSetOrderItems = (items: { product: Product | null; quantity: number }[]) => {
        setNewOrderProducts(items);
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
    };

    const handleDateChange = (e: Dayjs | null) => {
        setNewOrder({ ...newOrder, deliveryDate: e && e.toDate() });
    };

    const handleSubmit = () => {

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

        if (!edit) {
            createOrder(updatedOrder).then(response => setOrders(prevState => [...prevState, response]));
        } else {
            updateOrder(updatedOrder).then(response => setOrders(prevState =>
                prevState.map(order => order.id === response.id ? response : order)
            ));
        }

        setIsOpen(false);
        setEdit(false);
        setNewOrder(defaultOrder);
        setSelectedOrderSource(null);
        setNewOrderProducts([]);
    }


    const handleCancel = () => {
        setIsOpen(false);
        setNewOrderProducts([]);
        setNewOrder(defaultOrder);
        setEdit(false);
        setSelectedOrderSource(null);
    }

    const handleOrderSourceChange = (id: number) => {
        setSelectedOrderSource(id);
    }

    const handleEditButtonClicked = (id: number) => {
        setEdit(true);
        setIsOpen(true);
        const order = orders.find(order => order.id === id);
        if (order) {
            setNewOrder(order);
        } else {
            console.error("Order is undefined");
        }
        if (order?.orderSource.valueOf() !== 0) {
            setSelectedOrderSource(order?.orderSource.valueOf() ?? null);
        }
        if (order?.orderItems) {
            setNewOrderProducts(order.orderItems);
        }
    }

    const handleDelete = () => {
        if (orderToDelete) {
            deleteOrder(orderToDelete).then(() => setOrders(prevState => prevState.filter(o => o.id !== orderToDelete)));
            setDeleteConfirm(false);
            setOrderToDelete(null);
        }
    }

    const handleDeleteButtonClicked = (id: number) => {
        setDeleteConfirm(true);
        setOrderToDelete(id);
    }

    return (
        <>
            <Typography className={styles.title} variant="h4" gutterBottom> Bestellübersicht </Typography>
            <AddButton onClick={() => setIsOpen(true)} sxCustom={{marginBottom: 2}}/>
            <OrderTable orders={orders} onEdit={handleEditButtonClicked} onDelete={handleDeleteButtonClicked} />

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
                onAddProduct={handleOpenProductDialog}
                setOrderItems={handleSetOrderItems}
                newOrderItems={newOrderProducts}
            />

            <DeleteConfirmationDialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)} onConfirm={handleDelete} />
        </>
    );
}

export default ListOrders;
