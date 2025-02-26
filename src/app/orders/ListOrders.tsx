import { product1, product2, product3, product4 } from "../../domain/ExampleData.ts";
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


const availableProducts: Product[] = [
   product1, product2, product3, product4
];

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
// Ein paar felder dürfen nicht leer gelassen werden (z.b. telefonnummer, 1 produkt muss mindestens hinzugefügt werden, etc.)
// Fahrzeugauswahl (ist keine priorität, kann später gemacht werden. oder vielleicht sogar garnicht ka ob wir es überhaupt brauchen)
// Produkte werden noch nicht bei der api mitgeschickt
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

        loadOrders();
    }, []);


    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [newOrderProducts, setNewOrderProducts] = useState<{ product: Product | null; quantity: number }[]>([]);
    const [newOrder, setNewOrder] = useState<OrderResponse>(defaultOrder);
    const [edit, setEdit] = useState<boolean>(false);
    const [orders, setOrders] = useState<OrderResponse[]>([]);
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
        setNewOrder({ ...newOrder, deliveryDate: e && e.toDate() });
    };

    const handleSubmit = () => {

        if (!edit) {
            createOrder(newOrder).then(response => setOrders(prevState => [...prevState, response]));
        } else {
            updateOrder(newOrder).then(response => setOrders(prevState =>
                prevState.map(order => order.id === response.id ? response : order)
            ));
        }

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
