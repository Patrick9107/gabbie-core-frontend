import { Order } from "../../domain/Order.ts";
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Select,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField, IconButton, Box, Collapse
} from "@mui/material";
import { order1, order2, order3, order4, product1, product2, product3, product4, vehicle1, vehicle2, vehicle3 } from "../../domain/ExampleData.ts";
import AddButton from "../../core/ui/AddButton.tsx";
import {ChangeEvent, Fragment, useState} from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import { Product } from "../../domain/Product.ts";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {Vehicle} from "../../domain/Vehicle.ts";
import {KeyboardArrowDown, KeyboardArrowUp} from "@mui/icons-material";
import dayjs, {Dayjs} from "dayjs";
import {OrderStatus} from "../../domain/enums/OrderStatus.ts";
import {OrderSource} from "../../domain/enums/OrderSource.ts";
import DeleteConfirmationDialog from "../../core/ui/DeleteConfirmationDialog.tsx";


const availableProducts: Product[] = [
   product1, product2, product3, product4
];

const vehicles: Vehicle[] = [
    vehicle1, vehicle2, vehicle3
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
    const [openRows, setOpenRows] = useState(new Map<number, boolean>);
    const [edit, setEdit] = useState<boolean>(false);
    const [orders, setOrders] = useState<Order[]>([order1, order2, order3, order4]);
    const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
    const [orderToDelete, setOrderToDelete] = useState<number | null>(null);

    const toggleRow = (id: number) => {
        setOpenRows((prev) => {
            const newMap = new Map(prev);
            newMap.set(id, !newMap.get(id));
            return newMap;
        });
    };

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
        if (newOrder.id === -1) {
            const orderWithNewId = { ...newOrder, id: Math.max(...orders.map(o => o.id), 0) + 1 };
            setNewOrder(orderWithNewId);
        }

        setOrders((prevOrders) => {
            if (edit) {
                return prevOrders.map(o => o.id === newOrder.id ? newOrder : o); // Aktualisiert Bestellung an derselben Position
            }
            return [...prevOrders, newOrder]; // Fügt neue Bestellung hinzu
        });

        setEdit(false);
        setIsOpen(false);
        setNewOrder(defaultOrder);
        setNewOrderProducts([]);
    };

    const handleCancel = () => {
        setIsOpen(false);
        setNewOrderProducts([]);
        setNewOrder(defaultOrder);
        setEdit(false);
    }

    const handleVehicleChange = (id: number) => {
        // const selectedVehicle: Vehicle = vehicles.find(vehicle => vehicle.id === id);
        console.log(id);
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
            <h1>Bestellübersicht</h1>
            <AddButton onClick={() => setIsOpen(true)} />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Telefonnummer</TableCell>
                        <TableCell>Adresse</TableCell>
                        <TableCell>Preis</TableCell>
                        <TableCell>Aktueller Liefertermin</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map(order => (
                        <Fragment key={order.id}>
                            <TableRow onClick={() => toggleRow(order.id)}>
                                <TableCell>
                                    <IconButton onClick={() => toggleRow(order.id)}>
                                        {openRows.get(order.id) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                    </IconButton>
                                </TableCell>
                                <TableCell>{order.phoneNumber}</TableCell>
                                <TableCell>{order.address}</TableCell>
                                <TableCell>{order.totalAmount}€</TableCell>
                                <TableCell>{order.deliveryDate?.toLocaleDateString() ?? "nix"}</TableCell>
                                <TableCell>

                                </TableCell>
                            </TableRow>

                            <TableRow>
                                <TableCell colSpan={7} sx={{ paddingBottom: 0, paddingTop: 0, backgroundColor: "#f0f0f0" }}>
                                    <Collapse in={openRows.get(order.id)} timeout="auto" unmountOnExit>
                                        <Box sx={{ margin: 2 }}>
                                            <h3>Weitere Details</h3>
                                            <ul>
                                                <li> Status: {OrderStatus[order.status]} </li>
                                                <li> Quelle: {OrderSource[order.orderSource]} </li>
                                                <li> Notiz: {order.note} </li>
                                            </ul>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell> Produkt </TableCell>
                                                        <TableCell> Menge </TableCell>
                                                        <TableCell> Preis </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                {order.items.map(item => (
                                                    <TableRow>
                                                        <TableCell> {item.product.name} </TableCell>
                                                        <TableCell> {item.quantity} </TableCell>
                                                        <TableCell> {item.product.price}€ </TableCell>
                                                    </TableRow>
                                                ))}
                                                </TableBody>
                                            </Table>
                                            <Box sx={{display: "flex", marginTop: "8px", gap: "4px"}}>
                                                <Button variant="contained" startIcon={<EditIcon/>} onClick={() => handleEditButtonClicked(order.id)}> Bearbeiten </Button>
                                                <Button variant="contained" color="error" startIcon={<DeleteIcon/>} onClick={() => handleDeleteButtonClicked(order.id)}> Löschen </Button>
                                            </Box>
                                        </Box>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </Fragment>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isOpen} onClose={handleCancel}>
                <DialogTitle>{edit ? "Bestellung bearbeiten" : "Neue Bestellung"}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Telefonnummer"
                        name="phoneNumber"
                        value={edit ? newOrder.phoneNumber : ""}
                        fullWidth
                        margin="dense"
                        onChange={handleChange}
                    />
                    <TextField
                        label="Adresse"
                        name="address"
                        value={edit ? newOrder.address : ""}
                        fullWidth
                        margin="dense"
                        onChange={handleChange}
                    />
                    <Box sx={{display: "flex", gap: "8px", marginY: "4px"}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            sx={{marginY: "4px"}}
                            value={edit && newOrder.deliveryDate ? dayjs(newOrder.deliveryDate) : null}
                            label="Lieferdatum (optional)"
                            onChange={(e) => handleDateChange(e)}
                        />
                    </LocalizationProvider>
                        <Select
                            value={""}
                            onChange={(e) => handleVehicleChange(Number(e.target.value))}
                            displayEmpty
                            sx={{marginY: "4px"}}
                            autoWidth={true}
                        >
                            {/*todo*/}
                            <MenuItem value="">Fahrzeug auswählen (optional)</MenuItem>
                            {vehicles.map(vehicle => (
                                <MenuItem key={vehicle.id} value={vehicle.id}>{vehicle.licensePlate}</MenuItem>
                            ))}
                        </Select>
                    </Box>

                    <TextField
                        label="Notiz (optional)"
                        name="note"
                        value={edit ? newOrder.note : ""}
                        multiline
                        rows={3}
                        variant="outlined"
                        fullWidth
                        sx={{marginY: "4px"}}
                        onChange={handleChange}
                    />


                    <Table sx={{marginTop: "4px"}}>
                        <TableHead>
                            <TableRow>Produkte</TableRow>
                        </TableHead>
                        <TableBody>
                            {newOrderProducts.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Select
                                            value={item.product?.id || ""}
                                            onChange={(e) => handleProductChange(index, Number(e.target.value))}
                                            displayEmpty
                                            fullWidth
                                        >
                                            <MenuItem value="" disabled>Produkt wählen</MenuItem>
                                            {availableProducts.map(product => (
                                                <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                                            fullWidth
                                            inputRef={(input) => input && input.setAttribute("min", "1")}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleDeleteProduct(index)}>
                                            <DeleteIcon color={"error"} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button variant="contained" startIcon={<AddIcon />} fullWidth sx={{ marginTop: "8px" }} onClick={handleAddOrderItem}>
                        Produkt hinzufügen
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="error">Abbrechen</Button>
                    <Button onClick={handleSubmit} color="success">Speichern</Button>
                </DialogActions>
            </Dialog>

            <DeleteConfirmationDialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)} onConfirm={() => handleDelete()} />
        </>
    );
}

export default ListOrders;
