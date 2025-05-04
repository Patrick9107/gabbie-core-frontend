import React from 'react';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    IconButton,
    TextField,
    Stack,
    useTheme
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { Product } from "../../domain/Product.ts";

interface Props {
    product: Product;
    quantity: number;
    onAddClicked: (product: Product) => void;
    onRemoveButtonClicked: (product: Product) => void;
    onQuantityChange: (quantity: number, product: Product) => void;
}

const OrderItemCard = ({
                           product,
                           quantity,
                           onAddClicked,
                           onRemoveButtonClicked,
                           onQuantityChange
                       }: Props) => {

    const theme = useTheme();

    const handleQuantityInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = event.target.value;
        if (rawValue === '' || /^\d+$/.test(rawValue)) {
            const newQuantity = parseInt(rawValue, 10);
            onQuantityChange(isNaN(newQuantity) ? 0 : Math.max(0, newQuantity), product);
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            (event.target as HTMLInputElement).blur();
        }
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
        if (event.target.value === '' || parseInt(event.target.value, 10) <= 0) {
            onQuantityChange(0, product);
        }
    };

    return (
        <Card
            elevation={2}
            onClick={() => onAddClicked(product)}
            sx={{
                display: "flex",
                flexDirection: "column",
                height: '100%',
                borderRadius: theme.shape.borderRadius * 1.5,
                transition: "box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out",
                cursor: 'pointer',
                '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                }
            }}
        >
            <CardMedia
                sx={{
                    height: 160,
                    objectFit: "contain",
                    p: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: theme.palette.grey[100],
                }}
            >
                {product.imageUrl ? (
                    <Box
                        component="img"
                        src={product.imageUrl}
                        alt={product.name}
                        sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    />
                ) : (
                    <ImageNotSupportedIcon sx={{ fontSize: 60, color: theme.palette.grey[400] }} />
                )}
            </CardMedia>

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 1.5 }}>
                <Typography variant="subtitle1" component="div" noWrap sx={{ fontWeight: 'medium', mb: 0.5 }}>
                    {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    {product.price.toFixed(2)} €
                </Typography>

                <Box sx={{ mt: 'auto', pt: 1 }}>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                        <IconButton
                            aria-label={`Reduziere Menge von ${product.name}`}
                            size="small"
                            color="secondary"
                            onClick={(event) => { event.stopPropagation(); onRemoveButtonClicked(product); }}
                            disabled={quantity <= 0}
                        >
                            <RemoveCircleOutlineIcon />
                        </IconButton>

                        <TextField
                            aria-label={`Menge für ${product.name}`}
                            size="small"
                            sx={{
                                width: "4.5em",
                                '& .MuiInputBase-input': {
                                    textAlign: 'center',
                                    py: '4px',
                                    px: '2px',
                                    fontWeight: 'medium',
                                    fontSize: '0.9rem',
                                    '-moz-appearance': 'textfield',
                                },
                                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                    '-webkit-appearance': 'none',
                                    margin: 0,
                                },
                            }}
                            type="text"
                            inputMode="numeric"
                            value={quantity <= 0 ? '' : quantity.toString()}
                            onClick={(event) => event.stopPropagation()}
                            onChange={handleQuantityInputChange}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyPress}
                        />

                        <IconButton
                            aria-label={`Erhöhe Menge von ${product.name}`}
                            size="small"
                            color="primary"
                            onClick={(event) => { event.stopPropagation(); onAddClicked(product); }}
                        >
                            <AddCircleOutlineIcon />
                        </IconButton>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
};

export default OrderItemCard;