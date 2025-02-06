import { Order } from "../../domain/Order.ts";
import { order1, order2, order3, order4, product1, product2, product3, product4 } from "../../domain/ExampleData.ts";
import AddButton from "../../core/ui/AddButton.tsx";
import {ChangeEvent, useState} from "react";
import { Product } from "../../domain/Product.ts";
import {Dayjs} from "dayjs";
import DeleteConfirmationDialog from "../../core/ui/DeleteConfirmationDialog.tsx";
import OrderTable from "./OrderTable.tsx";
import OrderDialog from "./OrderDialog.tsx";
import {Typography} from "@mui/material";


const availableProducts: Product[] = [
   product1, product2, product3, product4
];

const defaultOrder = {
    id: -1,
    deliveryDate: null,
    address: "",
    phoneNumber: "",
    items: [],
    status: 1,
    note: "",
    orderSource: 1,
    deliveryTimeWindowStart: null,
    deliveryTimeWindowEnd: null,
    totalAmount: 0
}

function ListOrders() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [newOrderProducts, setNewOrderProducts] = useState<{ product: Product | null; quantity: number }[]>([]);
    const [newOrder, setNewOrder] = useState<Order>(defaultOrder);
    const [edit, setEdit] = useState<boolean>(false);
    const [orders, setOrders] = useState<Order[]>([order1, order2, order3, order4]);
    const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
    const [orderToDelete, setOrderToDelete] = useState<number | null>(null);
    const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null);

    const handleAddOrderItem = () => {
        setNewOrderProducts([...newOrderProducts, { product: null, quantity: 1 }]);
    };

    const handleProductChange = (index: number, productId: number) => {
        const selectedProduct = availableProducts.find(p => p.id === productId) || null;
        const updatedProducts = [...newOrderProducts];
        updatedProducts[index].product = selectedProduct;
        setNewOrderProducts(updatedProducts);
    };

    const handleQuantityChange = (index: number, quantity: number) => {
        const updatedProducts = [...newOrderProducts];
        updatedProducts[index].quantity = quantity;
        setNewOrderProducts(updatedProducts);
    };

    const handleDeleteProduct = (id: number) => {
        setNewOrderProducts(newOrderProducts.filter((_, index) => index !== id));
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
    };

    const handleDateChange = (e: Dayjs | null) => {
        setNewOrder({ ...newOrder, deliveryDate: e ? e.toDate() : null });
    };

    const handleSubmit = () => {
        let updatedOrder = newOrder;

        if (newOrder.id === -1) {
            updatedOrder = { ...newOrder, id: Math.max(0, ...orders.map(o => o.id)) + 1};
        }

        setOrders(prevOrders => {
            if (edit) {
                return prevOrders.map(o => o.id === updatedOrder.id ? updatedOrder : o);
            }
            return [...prevOrders, updatedOrder];
        });

        setIsOpen(false);
        setEdit(false);
        setNewOrder(defaultOrder);
        setNewOrderProducts([]);
        setSelectedVehicle(null);
    };


    const handleCancel = () => {
        setIsOpen(false);
        setNewOrderProducts([]);
        setNewOrder(defaultOrder);
        setEdit(false);
        setSelectedVehicle(null);
    }

    const handleVehicleChange = (id: number) => {
        setSelectedVehicle(id);
        console.log(selectedVehicle);
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
        if (order?.items) {
            setNewOrderProducts(order.items);
        } else {
            console.error("OrderItems is undefined");
        }
    }

    const handleDelete = () => {
        if (orderToDelete) {
            setOrders(orders.filter(o => o.id !== orderToDelete));
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
            <Typography sx={{ fontWeight: "bold" }} variant="h4" gutterBottom> Bestellübersicht </Typography>
            <AddButton onClick={() => setIsOpen(true)} />
            <OrderTable orders={orders} onEdit={handleEditButtonClicked} onDelete={handleDeleteButtonClicked} />

            <OrderDialog
                open={isOpen}
                edit={edit}
                order={newOrder}
                products={availableProducts}
                orderItems={newOrderProducts}
                onClose={handleCancel}
                onSubmit={handleSubmit}
                onChange={handleChange}
                onDateChange={handleDateChange}
                onVehicleChange={handleVehicleChange}
                selectedVehicle={selectedVehicle}
                onAddProduct={handleAddOrderItem}
                onDeleteProduct={handleDeleteProduct}
                onProductChange={handleProductChange}
                onQuantityChange={handleQuantityChange}
            />

            <DeleteConfirmationDialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)} onConfirm={() => handleDelete()} />
        </>
    );
}

export default ListOrders;
