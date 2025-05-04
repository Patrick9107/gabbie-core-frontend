import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Box,
    Select,
    MenuItem,
    Stack,
    FormControl,
    InputLabel,
    Alert,
    List,
    ListItem,
    ListItemText,
    Typography,
    Divider,
    Chip
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ChangeEvent } from "react";
import dayjs, { Dayjs } from "dayjs";
import { OrderResponse } from "../../domain/OrderResponse.ts";
import { Product } from "../../domain/Product.ts";
import { OrderSource } from "../../domain/enums/OrderSource.ts";
import OrderItemsDialog from "./OrderItemsDialog.tsx";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

interface Props {
    open: boolean;
    edit: boolean;
    isProductDialogOpen: boolean;
    onProductDialogClose: () => void;
    order: OrderResponse;
    products: Product[];
    onClose: () => void;
    onSubmit: () => void;
    onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onDateChange: (date: Dayjs | null) => void;
    onManageProductsClick: () => void;
    onOrderSourceChange: (id: number | null) => void;
    selectedOrderSource: number | null;
    setOrderItems: (items: { product: Product | null; quantity: number }[]) => void;
    newOrderItems: { product: Product | null; quantity: number }[];
    apiError?: string | null;
    clearApiError?: () => void;
}


const OrderDialog = ({
                         open,
                         edit,
                         isProductDialogOpen,
                         onProductDialogClose,
                         order,
                         products,
                         onClose,
                         onSubmit,
                         onChange,
                         onDateChange,
                         onManageProductsClick,
                         onOrderSourceChange,
                         selectedOrderSource,
                         setOrderItems,
                         newOrderItems,
                         apiError,
                         clearApiError
                     }: Props) => {

    const totalOrderValue = newOrderItems?.reduce((sum, item) => sum + ((item?.product?.price ?? 0) * item.quantity), 0) ?? 0; // Für Design hinzugefügt

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 'medium' }}>
                {edit ? "Bestellung bearbeiten" : "Neue Bestellung erstellen"}
            </DialogTitle>
            <DialogContent>
                {apiError && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={clearApiError}>
                        {apiError}
                    </Alert>
                )}

                <Stack spacing={2} sx={{ mt: 1 }}>
                    <TextField
                        required
                        label="Telefonnummer"
                        name="phoneNumber"
                        value={order.phoneNumber || ''}
                        fullWidth
                        margin="dense"
                        onChange={onChange}
                    />
                    <TextField
                        required
                        label="Adresse"
                        name="address"
                        value={order.address || ''}
                        fullWidth
                        margin="dense"
                        onChange={onChange}
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                            <DatePicker
                                label="Lieferdatum"
                                value={order.deliveryDate ? dayjs(order.deliveryDate) : null}
                                onChange={onDateChange}
                                format="DD.MM.YYYY"
                                sx={{ flexGrow: 1 }}
                                slotProps={{
                                    textField: {
                                        required: true,
                                        margin: "dense"
                                    },
                                }}
                            />
                        </LocalizationProvider>
                        <FormControl margin="dense" fullWidth required sx={{ flexGrow: 1 }}>
                            <InputLabel id="order-source-label">Quelle</InputLabel>
                            <Select
                                labelId="order-source-label"
                                label="Quelle *"
                                value={selectedOrderSource ?? ""}
                                onChange={(e) => onOrderSourceChange(Number(e.target.value))}

                            >
                                {Object.entries(OrderSource)
                                    .filter(([_key, value]) => typeof value === 'number')
                                    .map(([key, value]) => (
                                        <MenuItem key={value} value={value}>{key}</MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Stack>

                    <TextField
                        label="Notiz"
                        name="note"
                        value={order.note || ''}
                        multiline
                        rows={3}
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        onChange={onChange}
                    />

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="h6" component="div" sx={{ fontWeight: 'medium' }}>
                        Produkte
                    </Typography>
                    { newOrderItems?.length === 0 && (
                        <Alert severity="warning" sx={{ mb: 1 }}>Mindestens ein Produkt muss hinzugefügt werden</Alert>
                    )}
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<AddShoppingCartIcon />}
                        onClick={onManageProductsClick}
                        sx={{ mb: 1 }}
                    >
                        Produkte hinzufügen / bearbeiten
                    </Button>

                    {newOrderItems && newOrderItems.length > 0 && (
                        <Box sx={{ maxHeight: 150, overflowY: 'auto', border: (theme) => `1px solid ${theme.palette.divider}`, borderRadius: 1, p: 1 }}>
                            <List dense>
                                {newOrderItems.filter(item => item?.product).map((item, index) => (
                                    <ListItem key={`${item?.product?.id}-${index}`} disablePadding>
                                        <ListItemText
                                            primary={item?.product?.name}
                                            secondary={`${((item?.product?.price ?? 0) * item.quantity).toFixed(2)} €`}
                                        />
                                        <Chip label={`x ${item.quantity}`} size="small" />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                    {newOrderItems && newOrderItems.length > 0 && (
                        <Typography align="right" variant="subtitle1" sx={{fontWeight: 'bold', mt: 1}}>
                            Gesamtsumme: {totalOrderValue.toFixed(2)} €
                        </Typography>
                    )}

                </Stack>

                <OrderItemsDialog
                    isProductDialogOpen={isProductDialogOpen}
                    onProductDialogClose={onProductDialogClose}
                    products={products}
                    setOrderItems={setOrderItems}
                    newOrderItems={newOrderItems}
                />
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={onClose} color="inherit">Abbrechen</Button>
                <Button onClick={onSubmit} variant="contained" color="primary">
                    {edit ? "Änderungen speichern" : "Bestellung erstellen"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderDialog;