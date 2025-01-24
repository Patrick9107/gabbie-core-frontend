import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const orders = [
    { date: "19 Feb 2024", name: "Jakub Wachal", address: "7 PM", products: 9, price: "1 hrs", deposit: "-" },
    { date: "20 Feb 2024", name: "Patrick Poppinger", address: "7 PM", products: 9, price: "1 hrs", deposit: "-" },
    { date: "21 Feb 2024", name: "Benedik Hidalgo", address: "7 PM", products: 9, price: "1 hrs", deposit: "10-\u20ac" },
    { date: "22 Feb 2024", name: "Teric Marko", address: "7 PM", products: 9, price: "1 hrs", deposit: "-" },
    { date: "23 Feb 2024", name: "Rene Grandlits", address: "7 PM", products: 9, price: "1 hrs", deposit: "5-\u20ac" },
    { date: "24 Feb 2024", name: "Rene Wenz", address: "7 PM", products: 9, price: "1 hrs", deposit: "-" },
];

function OrderList() {
    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Bestellübersicht</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Best Nr.</TableCell>
                        <TableCell>Datum</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Adresse</TableCell>
                        <TableCell>Produkte</TableCell>
                        <TableCell>Preis</TableCell>
                        <TableCell>Pfand</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order, index) => (
                        <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>{order.name}</TableCell>
                            <TableCell>{order.address}</TableCell>
                            <TableCell>{order.products}</TableCell>
                            <TableCell>{order.price}</TableCell>
                            <TableCell>{order.deposit}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default OrderList;