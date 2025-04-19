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
    Checkbox,
    MenuItem, Menu,
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import FilterListIcon from "@mui/icons-material/FilterList";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useState, Fragment, useEffect } from 'react';
import { OrderStatus } from "../../domain/enums/OrderStatus.ts";
import { OrderSource } from "../../domain/enums/OrderSource.ts";
import { OrderResponse } from "../../domain/OrderResponse.ts";
import { useNavigate } from "react-router-dom";
import { Order } from '../../domain/Order.ts';

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
    const [uncompletedOrders, setUncompletedOrders] = useState<Order[]>([]);
    const [filterDate, setFilterDate] = useState<string>("");
    const navigate = useNavigate();

    const [sortOptions, setSortOptions] = useState<{ key: "date" | "price"; asc: boolean } | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

  const filteredOrders = filterDate
    ? orders.filter(order => {
      if (!order.deliveryDate) return false;

      const delivery = new Date(order.deliveryDate);
      const [year, month, day] = filterDate.split("-"); // yyyy-mm-dd

      return (
        delivery.getFullYear() === parseInt(year) &&
        delivery.getMonth() + 1 === parseInt(month) && // getMonth is 0-based
        delivery.getDate() === parseInt(day)
      );
    })
    : orders;

    const sortedOrders = [...filteredOrders];
    if (sortOptions) {
      sortedOrders.sort((a, b) => {
        const getValue = (key: "date" | "price", order: OrderResponse) => {
          switch (key) {
            case "date":
              { const time = new Date(order.deliveryDate || "").getTime();
              return isNaN(time) ? (sortOptions!.asc ? Infinity : -Infinity) : time; }
            case "price":
              return order.totalAmount;
          }
        };

        const aValue = getValue(sortOptions.key, a);
        const bValue = getValue(sortOptions.key, b);
        return sortOptions.asc ? aValue - bValue : bValue - aValue;
      });
    }

    const toggleRow = (id: number) => {
        if (selecting) return; // Verhindert das Aufklappen während der Auswahl
        setOpenRows(prev => {
            const newMap = new Map(prev);
            newMap.set(id, !newMap.get(id));
            return newMap;
        });
    };

    const toggleOrderSelection = (id: number) => {
        setSelectedOrders(prev =>
            prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id]
        );
    };

    const handleRouteCalculation = () => {
        const selectedOrdersData = orders.filter(order => selectedOrders.includes(order.id));
        navigate(`/routes`, { state: { orders: selectedOrdersData } });
    };

    useEffect(() => {
        const result = orders.filter(o =>
          !o.phoneNumber || !o.address || o.orderItems.length === 0 || !o.deliveryDate
        );

        setUncompletedOrders(result);
    }, [orders]);

    return (
        <Paper sx={{ overflow: "hidden", borderRadius: "12px", boxShadow: 3, p: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#3d9970", "&:hover": { backgroundColor: "#33805d" } }}
                        onClick={() => {
                            setSelecting(prev => {
                                if (prev) setSelectedOrders([]);
                                return !prev;
                            });
                        }}
                    >
                        {selecting ? "Auswahl beenden" : "Bestellungen auswählen"}
                    </Button>
                    {selecting && (
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: "#3d9970", "&:hover": { backgroundColor: "#33805d" } }}
                            onClick={handleRouteCalculation}
                            disabled={selectedOrders.length === 0}
                        >
                            Route berechnen
                        </Button>
                    )}
                </Box>
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    style={{ border: "1px solid #ccc", padding: "6px 12px", borderRadius: "4px", font: "inherit" }}
                />
            </Box>

            <Table sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#3d9970", "& th": { color: "white", fontWeight: "bold" } }}>
                        <TableCell />
                        <TableCell>Telefonnummer</TableCell>
                        <TableCell>Adresse</TableCell>
                        <TableCell>Preis</TableCell>
                        <TableCell>Aktueller Liefertermin</TableCell>
                        <TableCell>Aktionen</TableCell>
                        <TableCell>
                          <Box sx={{ position: "relative" }}>
                            <IconButton size="small" onClick={handleClick}>
                              <FilterListIcon sx={{ color: "white" }} />
                            </IconButton>
                            <Menu
                              anchorEl={anchorEl}
                              open={open}
                              onClose={handleClose}
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            >
                              <MenuItem onClick={() => { setSortOptions({ key: "date", asc: true }); handleClose(); }}>Datum ↑</MenuItem>
                              <MenuItem onClick={() => { setSortOptions({ key: "date", asc: false }); handleClose(); }}>Datum ↓</MenuItem>
                              <MenuItem onClick={() => { setSortOptions({ key: "price", asc: true }); handleClose(); }}>Preis ↑</MenuItem>
                              <MenuItem onClick={() => { setSortOptions({ key: "price", asc: false }); handleClose(); }}>Preis ↓</MenuItem>
                            </Menu>
                          </Box>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {sortedOrders.map(order => (
                        <Fragment key={order.id}>
                            <TableRow
                              sx={{
                                  backgroundColor: selectedOrders.includes(order.id)
                                    ? "#d5f5e3"
                                    : uncompletedOrders.some(o => o.id === order.id)
                                      ? "#ffdddd"
                                      : "inherit",
                                  cursor: "pointer"
                              }}
                            >
                                <TableCell>
                                    {selecting ? (
                                        <Checkbox
                                            checked={selectedOrders.includes(order.id)}
                                            onChange={() => toggleOrderSelection(order.id)}
                                        />
                                    ) : (
                                        <IconButton size="small" onClick={() => toggleRow(order.id)}>
                                            {openRows.get(order.id) ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                        </IconButton>
                                    )}
                                </TableCell>
                                <TableCell>{order.phoneNumber}</TableCell>
                                <TableCell>{order.address}</TableCell>
                                <TableCell>{order.totalAmount}€</TableCell>
                                <TableCell>
                                    {order?.deliveryDate
                                        ? new Date(order.deliveryDate).toLocaleDateString()
                                        : "Kein Lieferdatum angegeben"}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => onEdit(order.id)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton color="error" onClick={() => onDelete(order.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                              <TableCell>
                              {/*  Leer halten !!!!!!!!!*/}
                              </TableCell>
                            </TableRow>

                            {!selecting && (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ padding: 0, backgroundColor: "#f4f6f8" }}>
                                        <Collapse in={openRows.get(order.id)} timeout="auto" unmountOnExit>
                                            <Box sx={{ margin: 2 }}>
                                                <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                                                    Weitere Details
                                                </Typography>
                                                <ul>
                                                    <li>Status: {OrderStatus[order.orderStatus]}</li>
                                                    <li>Quelle: {OrderSource[order.orderSource]}</li>
                                                    <li>Notiz: {order.note}</li>
                                                </ul>
                                                <Table size="small">
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
                                                                <TableCell>{item.product.price.toFixed(2)}€</TableCell>
                                                            </TableRow>
                                                        ))}
                                                        <TableRow>
                                                            <TableCell sx={sumSx}>Summe</TableCell>
                                                            <TableCell sx={sumSx}>
                                                                {order.orderItems?.reduce((prev, curr) => prev + curr.quantity, 0)}
                                                            </TableCell>
                                                            <TableCell sx={sumSx}>{order.totalAmount.toFixed(2)}€</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            )}
                        </Fragment>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
};

export default OrderTable;
