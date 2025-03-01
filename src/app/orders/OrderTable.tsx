import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Collapse,
    Box,
    Button,
    Paper,
    Typography,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import { useState, Fragment } from "react";
import { OrderStatus } from "../../domain/enums/OrderStatus.ts";
import { OrderSource } from "../../domain/enums/OrderSource.ts";
import { OrderResponse } from "../../domain/OrderResponse.ts";

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

    const toggleRow = (id: number) => {
        setOpenRows((prev) => {
            const newMap = new Map(prev);
            newMap.set(id, !newMap.get(id));
            return newMap;
        });
    };

    return (
      <Paper sx={{ overflow: "hidden", borderRadius: "12px", boxShadow: 3 }}>
          <Table sx={{ minWidth: 650 }}>
              <TableHead>
                  <TableRow sx={{ backgroundColor: "#3d9970", "& th": { color: "white", fontWeight: "bold" } }}>
                      <TableCell />
                      <TableCell>Telefonnummer</TableCell>
                      <TableCell>Adresse</TableCell>
                      <TableCell>Preis</TableCell>
                      <TableCell>Aktueller Liefertermin</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                  {orders.map((order, index) => (
                    <Fragment key={order.id}>
                        <TableRow
                          onClick={() => toggleRow(order.id)}
                          sx={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white", cursor: "pointer" }}
                        >
                            <TableCell>
                                <IconButton size="small">
                                    {openRows.get(order.id) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                </IconButton>
                            </TableCell>
                            <TableCell>{order.phoneNumber}</TableCell>
                            <TableCell>{order.address}</TableCell>
                            <TableCell>{order.totalAmount}€</TableCell>
                            <TableCell>
                                {order?.deliveryDate
                                  ? new Date(order.deliveryDate).getTime()
                                    ? new Date(order.deliveryDate).toLocaleDateString()
                                    : "Kein Lieferdatum angegeben"
                                  : "Kein Lieferdatum angegeben"}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={6} sx={{ padding: 0, backgroundColor: "#f4f6f8" }}>
                                <Collapse in={openRows.get(order.id)} timeout="auto" unmountOnExit>
                                    <Box sx={{
                                        margin: 2,
                                        padding: 3,
                                        borderRadius: "8px",
                                        backgroundColor: "#f9f9f9",
                                        boxShadow: 2,
                                        width: "100%", // Full width
                                        border: "1px solid #e0e0e0",
                                    }}>
                                        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                                            Weitere Details
                                        </Typography>
                                        <ul style={{
                                            margin: 0,
                                            padding: "0 16px",
                                            listStyleType: "none",
                                        }}>
                                            <li style={{ padding: "8px 0", borderBottom: "1px solid #e0e0e0" }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Status: <strong>{OrderStatus[order.orderStatus]}</strong>
                                                </Typography>
                                            </li>
                                            <li style={{ padding: "8px 0", borderBottom: "1px solid #e0e0e0" }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Quelle: <strong>{OrderSource[order.orderSource]}</strong>
                                                </Typography>
                                            </li>
                                            <li style={{ padding: "8px 0" }}>
                                                <Typography variant="body2" color="textSecondary">
                                                    Notiz: <strong>{order.note}</strong>
                                                </Typography>
                                            </li>
                                        </ul>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow sx={{ backgroundColor: "#eeeeee" }}>
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
                                                      <TableCell>{item.product.price.toFixed(2)}€</TableCell>
                                                  </TableRow>
                                                ))}
                                                <TableRow>
                                                    <TableCell sx={sumSx}>Summe</TableCell>
                                                    <TableCell sx={sumSx}>
                                                        {order.orderItems?.reduce(
                                                          (previousValue, currentValue) => previousValue + currentValue.quantity,
                                                          0
                                                        )}
                                                    </TableCell>
                                                    <TableCell sx={sumSx}>{order.totalAmount.toFixed(2)}€</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, marginTop: 2 }}>
                                            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => onEdit(order.id)}>
                                                Bearbeiten
                                            </Button>
                                            <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={() => onDelete(order.id)}>
                                                Löschen
                                            </Button>
                                        </Box>
                                    </Box>
                                </Collapse>
                            </TableCell>
                        </TableRow>
                    </Fragment>
                  ))}
              </TableBody>
          </Table>
      </Paper>
    );
};

export default OrderTable;