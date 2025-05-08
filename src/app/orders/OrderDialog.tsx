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
    Chip,
    SelectChangeEvent
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import 'dayjs/locale/de';
import { ChangeEvent } from "react";
import dayjs, { Dayjs } from "dayjs";
import { OrderResponse } from "../../domain/OrderResponse.ts";
import { Product } from "../../domain/Product.ts";
import { OrderSource } from "../../domain/enums/OrderSource.ts";
import OrderItemsDialog from "./OrderItemsDialog.tsx";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

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

    const totalOrderValue = newOrderItems?.reduce((sum, item) => sum + ((item?.product?.price ?? 0) * item.quantity), 0) ?? 0;

    const dialogTitleText = edit ? "Bestellung bearbeiten" : "Neue Bestellung erstellen";
    const TitleIconComponent = edit ? EditIcon : AddCircleOutlineIcon;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: "12px",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                }
            }}
        >
            <DialogTitle sx={{ pt: 3, pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 1 }}>
                    <TitleIconComponent sx={{ fontSize: 36, color: "primary.main" }} />
                    <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                        {dialogTitleText}
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 2, pb: 2 }}>
                {apiError && (
                    <Alert severity="error" sx={{ mb: 2, mt: 1 }} onClose={clearApiError}>
                        {apiError}
                    </Alert>
                )}

                <Stack spacing={2.5} sx={{ mt: apiError ? 0 : 1 }}>
                    <TextField
                        label="Telefonnummer"
                        name="phoneNumber"
                        value={order.phoneNumber || ''}
                        fullWidth
                        variant="outlined"
                        onChange={onChange}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Adresse"
                        name="address"
                        value={order.address || ''}
                        fullWidth
                        variant="outlined"
                        onChange={onChange}
                        InputLabelProps={{ shrink: true }}
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
                            <DatePicker
                                label="Lieferdatum"
                                value={order.deliveryDate ? dayjs(order.deliveryDate) : null}
                                onChange={onDateChange}
                                format="DD.MM.YYYY"
                                sx={{ flexGrow: 1 }}
                                slotProps={{
                                    textField: {
                                        variant: "outlined",
                                        InputLabelProps: { shrink: true }
                                    },
                                }}
                            />
                        </LocalizationProvider>
                        <FormControl fullWidth variant="outlined" sx={{ flexGrow: 1 }}>
                            <InputLabel id="order-source-label" shrink={true}>Quelle</InputLabel>
                            <Select
                                labelId="order-source-label"
                                label="Quelle"
                                value={selectedOrderSource ?? ""}
                                onChange={(e: SelectChangeEvent<number>) => onOrderSourceChange(Number(e.target.value))}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    <em>Bitte auswählen</em>
                                </MenuItem>
                                {Object.entries(OrderSource)
                                    .filter(([_key, value]) => typeof value === 'number')
                                    .map(([key, value]) => (
                                        <MenuItem key={value as number} value={value as number}>{key}</MenuItem>
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
                        onChange={onChange}
                        InputLabelProps={{ shrink: true }}
                    />

                    <Divider sx={{ my: 2, borderColor: 'grey.300' }} />

                    <Typography variant="h6" component="div" sx={{ fontWeight: "bold", color: 'text.primary' }}>
                        Produkte
                    </Typography>
                    { newOrderItems?.length === 0 && (
                        <Alert severity="info" sx={{ mb: 1.5, mt: 0.5 }}>Mindestens ein Produkt muss hinzugefügt werden, um die Bestellung zu vervollständigen</Alert>
                    )}
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<AddShoppingCartIcon />}
                        onClick={onManageProductsClick}
                        sx={{
                            mb: 1.5,
                            textTransform: 'none',
                            borderRadius: '8px',
                            borderColor: 'primary.main',
                            color: 'primary.main',
                            '&:hover': {
                                backgroundColor: 'primary.lighter',
                                borderColor: 'primary.dark',
                            }
                        }}
                    >
                        Produkte hinzufügen / bearbeiten
                    </Button>

                    {newOrderItems && newOrderItems.length > 0 && (
                        <Box sx={{ maxHeight: 180, overflowY: 'auto', border: (theme) => `1px solid ${theme.palette.grey[300]}`, borderRadius: "8px", p: 1.5 }}>
                            <List dense>
                                {newOrderItems.filter(item => item?.product).map((item, index) => (
                                    <ListItem
                                        key={`${item?.product?.id}-${index}`}
                                        disablePadding
                                        sx={{ mb: 0.5 }}
                                    >
                                        <ListItemText
                                            primary={<Typography variant="body2" sx={{fontWeight: 'medium'}}>{item?.product?.name}</Typography>}
                                            secondary={`${((item?.product?.price ?? 0) * item.quantity).toFixed(2)} €`}
                                        />
                                        <Chip label={`x ${item.quantity}`} size="small" variant="outlined" sx={{ ml:1 }} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                    {newOrderItems && newOrderItems.length > 0 && (
                        <Typography align="right" variant="subtitle1" sx={{fontWeight: 'bold', mt: 1.5, color: 'text.primary'}}>
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
            <DialogActions
                sx={{
                    justifyContent: "flex-end",
                    paddingBottom: "24px",
                    paddingTop: "16px",
                    paddingX: "24px",
                    gap: "12px",
                    borderTop: (theme) => `1px solid ${theme.palette.divider}` , mt: 2
                }}
            >
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="secondary"
                    sx={{ borderRadius: "8px", textTransform: 'none', borderColor: 'grey.400', color: 'text.primary' }}
                >
                    Abbrechen
                </Button>
                <Button
                    onClick={onSubmit}
                    variant="contained"
                    color="primary"
                    sx={{ borderRadius: "8px", textTransform: 'none' }}
                >
                    {edit ? "Änderungen speichern" : "Bestellung erstellen"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderDialog;