import { Table, TableBody, TableCell, TableHead, TableRow, IconButton, Collapse, Box, Button, Checkbox } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useState, Fragment } from "react";
import { OrderStatus } from "../../domain/enums/OrderStatus.ts";
import { OrderSource } from "../../domain/enums/OrderSource.ts";
import { OrderResponse } from "../../domain/OrderResponse.ts";
import { useNavigate } from "react-router-dom"; // Für Navigation

interface Props {
    orders: OrderResponse[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

const sumSx = {
    borderBottom: "none",
    fontWeight: "bold"
};

const OrderTable = ({ orders, onEdit, onDelete }: Props) => {
    const [openRows, setOpenRows] = useState(new Map<number, boolean>());
    const [selecting, setSelecting] = useState(false);
    const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
    const navigate = useNavigate(); // React-Router für Navigation

    const toggleRow = (id: number) => {
        setOpenRows((prev) => {
            const newMap = new Map(prev);
            newMap.set(id, !newMap.get(id));
            return newMap;
        });
    };

    const toggleOrderSelection = (id: number) => {
        setSelectedOrders((prev) =>
            prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id]
        );
    };

    const handleRouteCalculation = () => {
        const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.id));

        navigate(`/routes`, { state: { orders: selectedOrdersData } });
    };

    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Button variant="contained" onClick={() => setSelecting(!selecting)}>
                    {selecting ? "Auswahl beenden" : "Bestellungen auswählen"}
                </Button>
                {selecting && (
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleRouteCalculation}
                        disabled={selectedOrders.length === 0}
                    >
                        Route berechnen
                    </Button>
                )}
            </Box>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        {selecting && <TableCell>Auswahl</TableCell>}
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
                                {selecting && (
                                    <TableCell>
                                        <Checkbox
                                            checked={selectedOrders.includes(order.id)}
                                            onChange={() => toggleOrderSelection(order.id)}
                                        />
                                    </TableCell>
                                )}
                                <TableCell>{order.phoneNumber}</TableCell>
                                <TableCell>{order.address}</TableCell>
                                <TableCell>{order.totalAmount}€</TableCell>
                                <TableCell>{order?.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "Kein Lieferdatum angegeben"}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan={6} sx={{ paddingBottom: 0, paddingTop: 0, backgroundColor: "#f0f0f0" }}>
                                    <Collapse in={openRows.get(order.id)} timeout="auto" unmountOnExit>
                                        <Box sx={{ margin: 2 }}>
                                            <h3>Weitere Details</h3>
                                            <ul>
                                                <li>Status: {OrderStatus[order.orderStatus]}</li>
                                                <li>Quelle: {OrderSource[order.orderSource]}</li>
                                                <li>Notiz: {order.note}</li>
                                            </ul>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Produkt</TableCell>
                                                        <TableCell>Menge</TableCell>
                                                        <TableCell>Preis</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {order.orderItems?.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{item.product.name}</TableCell>
                                                            <TableCell>{item.quantity}</TableCell>
                                                            <TableCell>{item.product.price}€</TableCell>
                                                        </TableRow>
                                                    ))}
                                                    <TableRow>
                                                        <TableCell sx={sumSx}>Summe</TableCell>
                                                        <TableCell sx={sumSx}>
                                                            {order.orderItems?.reduce((prev, curr) => prev + curr.quantity, 0)}
                                                        </TableCell>
                                                        <TableCell sx={sumSx}>{order.totalAmount}€</TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                            <Box sx={{ display: "flex", marginTop: "8px", gap: "4px" }}>
                                                <Button variant="contained" startIcon={<EditIcon />} onClick={() => onEdit(order.id)}>Bearbeiten</Button>
                                                <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => onDelete(order.id)}>Löschen</Button>
                                            </Box>
                                        </Box>
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </Fragment>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};

export default OrderTable;
