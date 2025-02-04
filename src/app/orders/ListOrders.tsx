import {Order} from "../../domain/Order.ts";
import {Button, Select, Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import {order1} from "../../domain/ExampleData.ts";
import {order2} from "../../domain/ExampleData.ts";
import {order3} from "../../domain/ExampleData.ts";
import {order4} from "../../domain/ExampleData.ts";
import AddButton from "../../core/ui/AddButton.tsx";

const orders: Order[] = [
    order1,
    order2,
    order3,
    order4
]

function ListOrders() {
    return (
        <>
        <h1>Bestellübersicht</h1>
           <AddButton></AddButton>
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
        </>
    );
}

export default ListOrders;