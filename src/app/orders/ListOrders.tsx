import {Order} from "../../domain/Order.ts";
import {
    Button,
    Dialog, DialogActions,
    DialogContent,
    DialogTitle,
    Select,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow, TextField
} from "@mui/material";
import {order1} from "../../domain/ExampleData.ts";
import {order2} from "../../domain/ExampleData.ts";
import {order3} from "../../domain/ExampleData.ts";
import {order4} from "../../domain/ExampleData.ts";
import AddButton from "../../core/ui/AddButton.tsx";
import {ChangeEvent, useState} from "react";


const orders: Order[] = [
    order1,
    order2,
    order3,
    order4
]

function ListOrders() {

    const [isOpen, setIsOpen] = useState<boolean>(false);
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

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        console.log("Neue Order:", newOrder);
        orders.push(newOrder);
        setIsOpen(false);
    };


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
                        <TableCell>Bevorzugter Liefertermin</TableCell>
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
                    <TextField
                        label="Preis"
                        name="totalAmount"
                        type="number"
                        fullWidth
                        margin="dense"
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsOpen(false)}>Abbrechen</Button>
                    <Button onClick={handleSubmit} color="primary">Speichern</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ListOrders;