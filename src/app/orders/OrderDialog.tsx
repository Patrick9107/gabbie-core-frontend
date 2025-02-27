import { Order } from "../../domain/Order.ts";
import { Product } from "../../domain/Product.ts";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Box, Select, MenuItem, Table, TableBody, TableCell, TableHead, TableRow, IconButton } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ChangeEvent } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs, { Dayjs } from "dayjs";
import {OrderSource} from "../../domain/enums/OrderSource.ts";

interface Props {
    open: boolean;
    edit: boolean;
    order: Order;
    products: Product[];
    orderItems: { product: Product | null; quantity: number }[];
    onClose: () => void;
    onSubmit: () => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onDateChange: (date: Dayjs | null) => void;
    onAddProduct: () => void;
    onOrderSourceChange: (id: number) => void;
    selectedOrderSource: number | null;
    onDeleteProduct: (index: number) => void;
    onProductChange: (index: number, productId: number) => void;
    onQuantityChange: (index: number, quantity: number) => void;
}

const OrderDialog = ({ open, edit, order, products, orderItems, onClose, onSubmit, onChange, onDateChange, onAddProduct, onOrderSourceChange, selectedOrderSource, onDeleteProduct, onProductChange, onQuantityChange }: Props) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{edit ? "Bestellung bearbeiten" : "Neue Bestellung"}</DialogTitle>
            <DialogContent>
                <TextField label="Telefonnummer" name="phoneNumber" value={order.phoneNumber} fullWidth margin="dense" onChange={onChange} />
                <TextField label="Adresse" name="address" value={order.address} fullWidth margin="dense" onChange={onChange} />
                <Box sx={{ display: "flex", gap: "8px", marginY: "4px" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker label="Lieferdatum (optional)" value={order.deliveryDate ? dayjs(order.deliveryDate) : null} onChange={onDateChange} />
                    </LocalizationProvider>
                    {/*<Select value={selectedVehicle ?? ""} onChange={(e) => onVehicleChange(Number(e.target.value))} displayEmpty>*/}
                    {/*    <MenuItem value="">Work in Progress</MenuItem>*/}
                    {/*    {vehicles.map(vehicle => (*/}
                    {/*        <MenuItem key={vehicle.id} value={vehicle.id} disabled>{vehicle.licensePlate}</MenuItem>*/}
                    {/*    ))}*/}
                    {/*</Select>*/}
                    <Select value={selectedOrderSource ?? ""} onChange={(e) => onOrderSourceChange(Number(e.target.value))} displayEmpty fullWidth sx={{width: "50%"}}>
                        <MenuItem value="" disabled>Quelle auswählen</MenuItem>
                        {Object.entries(OrderSource)
                            .filter(([_key, value]) => !isNaN(Number(value)))
                            .map(([key, value]) => (
                                <MenuItem key={value} value={value}>{key}</MenuItem>
                            ))}
                    </Select>

                </Box>
                <TextField label="Notiz (optional)" name="note" value={order.note} multiline rows={3} variant="outlined" fullWidth sx={{ marginY: "4px" }} onChange={onChange} />
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Produkt</TableCell>
                            <TableCell>Menge</TableCell>
                            <TableCell>Aktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderItems.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <Select value={item.product?.id || ""} onChange={(e) => onProductChange(index, Number(e.target.value))} displayEmpty fullWidth>
                                        <MenuItem value="" disabled>Produkt wählen</MenuItem>
                                        {products.map(product => (
                                            <MenuItem key={product.id} value={product.id}>{product.name}</MenuItem>
                                        ))}
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <TextField type="number" value={item.quantity} onChange={(e) => onQuantityChange(index, Number(e.target.value))} fullWidth inputRef={(input) => input && input.setAttribute("min", "1")} />
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => onDeleteProduct(index)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <Button variant="contained" startIcon={<AddIcon />} fullWidth sx={{ marginTop: "8px" }} onClick={onAddProduct}>
                    Produkt hinzufügen
                </Button>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">Abbrechen</Button>
                <Button onClick={onSubmit} color="success">Speichern</Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderDialog;
