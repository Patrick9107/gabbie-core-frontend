import { Order } from "../../domain/Order.ts";
import {Table, TableBody, TableCell, TableHead, TableRow, IconButton, Collapse, Box, Button} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import { useState, Fragment } from "react";
import { OrderStatus } from "../../domain/enums/OrderStatus.ts";
import { OrderSource } from "../../domain/enums/OrderSource.ts";

interface Props {
    orders: Order[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const OrderTable = ({ orders, onEdit, onDelete }: Props) => {
    const [openRows, setOpenRows] = useState(new Map<number, boolean>());

    const toggleRow = (id: number) => {
        setOpenRows((prev) => {
            const newMap = new Map(prev);
            newMap.set(id, !newMap.get(id));
            return newMap;
        });
    };

    return (
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
                                <IconButton>
                                    {openRows.get(order.id) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                </IconButton>
                            </TableCell>
                            <TableCell>{order.phoneNumber}</TableCell>
                            <TableCell>{order.address}</TableCell>
                            <TableCell>{order.totalAmount}€</TableCell>
                            <TableCell>{order.deliveryDate?.toLocaleDateString() ?? "nix"}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={6} sx={{ paddingBottom: 0, paddingTop: 0, backgroundColor: "#f0f0f0" }}>
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
                                                {order.items.map((item, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell> {item.product.name} </TableCell>
                                                        <TableCell> {item.quantity} </TableCell>
                                                        <TableCell> {item.product.price}€ </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        <Box sx={{display: "flex", marginTop: "8px", gap: "4px"}}>
                                            <Button variant="contained" startIcon={<EditIcon/>} onClick={() => onEdit(order.id)}> Bearbeiten </Button>
                                            <Button variant="contained" color="error" startIcon={<DeleteIcon/>} onClick={() => onDelete(order.id)}> Löschen </Button>
                                        </Box>
                                    </Box>
                                </Collapse>
                            </TableCell>
                        </TableRow>
                    </Fragment>
                ))}
            </TableBody>
        </Table>
    );
};

export default OrderTable;