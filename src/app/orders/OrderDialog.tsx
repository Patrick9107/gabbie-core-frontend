import { Order } from "../../domain/Order.ts";
import { Product } from "../../domain/Product.ts";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Box, Select, MenuItem } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ChangeEvent } from "react";
import dayjs, { Dayjs } from "dayjs";
import {OrderSource} from "../../domain/enums/OrderSource.ts";
import OrderItemsDialog from "./OrderItemsDialog.tsx";

interface Props {
    open: boolean;
    edit: boolean;
    isProductDialogOpen: boolean;
    onProductDialogClose: () => void;
    order: Order;
    products: Product[];
    onClose: () => void;
    onSubmit: () => void;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onDateChange: (date: Dayjs | null) => void;
    onAddProduct: () => void;
    onOrderSourceChange: (id: number) => void;
    selectedOrderSource: number | null;
    setOrderItems: (items: { product: Product | null; quantity: number }[]) => void;
    newOrderItems:  { product: Product | null; quantity: number }[];
}

const OrderDialog = ({ open, edit, isProductDialogOpen, onProductDialogClose, order, products, onClose, onSubmit, onChange, onDateChange, onAddProduct, onOrderSourceChange, selectedOrderSource, setOrderItems, newOrderItems }: Props) => {

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
                <Button variant="contained" fullWidth sx={{ marginTop: "8px" }} onClick={onAddProduct}>
                    Produkte verwalten
                </Button>
                <OrderItemsDialog
                    isProductDialogOpen={isProductDialogOpen}
                    onProductDialogClose={onProductDialogClose}
                    products={products}
                    setOrderItems={setOrderItems}
                    newOrderItems={newOrderItems}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="error">Abbrechen</Button>
                <Button onClick={onSubmit} color="success">Speichern</Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderDialog;
