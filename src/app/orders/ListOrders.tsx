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
    TextField, IconButton, Typography
} from "@mui/material";
import { order1, order2, order3, order4, product1, product2, product3, product4 } from "../../domain/ExampleData.ts";
import AddButton from "../../core/ui/AddButton.tsx";
import { ChangeEvent, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { Product } from "../../domain/Product.ts";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

const orders: Order[] = [order1, order2, order3, order4];

const availableProducts: Product[] = [
   product1, product2, product3, product4
];

function ListOrders() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [newOrderProducts, setNewOrderProducts] = useState<{ product: Product | null; quantity: number }[]>([]);
    const [newOrder, setNewOrder] = useState<Order>({
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
    });

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

    const handleSubmit = () => {
        console.log("Neue Order:", newOrder);
        orders.push(newOrder);
        setIsOpen(false);
    };

    const handleCancel = () => {
        setIsOpen(false);
        setNewOrderProducts([]);
    }

    return (
        <>
            <h1>Bestellübersicht</h1>
            <AddButton onClick={() => setIsOpen(true)} />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Telefonnummer</TableCell>
                        <TableCell>Adresse</TableCell>
                        <TableCell>Produkte</TableCell>
                        <TableCell>Preis</TableCell>
                        <TableCell>Aktueller Liefertermin</TableCell>
                        <TableCell>Lieferfahrzeug</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map(order => (
                        <TableRow key={order.id}>
                            <TableCell>{order.phoneNumber}</TableCell>
                            <TableCell>{order.address}</TableCell>
                            <TableCell><Button>Anzeigen</Button></TableCell>
                            <TableCell>{order.totalAmount}€</TableCell>
                            <TableCell>{order.deliveryDate?.toLocaleDateString() ?? "nix"}</TableCell>
                            <TableCell><Select variant={'outlined'}></Select></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogTitle>Neue Bestellung</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Telefonnummer"
                        name="phoneNumber"
                        fullWidth
                        margin="dense"
                        onChange={handleChange}
                    />
                    <TextField
                        label="Adresse"
                        name="address"
                        fullWidth
                        margin="dense"
                        onChange={handleChange}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Lieferdatum (optional)"></DatePicker>
                    </LocalizationProvider>
                    <Typography>
                        Lieferfahrzeug
                        <Select variant={'outlined'}></Select>
                    </Typography>


                    <h3>Produkte</h3>
                    <Table>
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
                    <Button sx={{ backgroundColor: "#16a34a" }} onClick={handleAddOrderItem}>
                        <AddIcon sx={{ color: "white", fontSize: 32 }} />
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancel} color="error">Abbrechen</Button>
                    <Button onClick={handleSubmit} color="success">Speichern</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ListOrders;
