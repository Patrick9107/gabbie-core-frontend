import {
    Box,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Typography,
    Chip,
    Stack,
    Tooltip,
    IconButton
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageNotSupportedIcon from '@mui/icons-material/ImageNotSupported';
import { Product } from "../../domain/Product.ts";
import { useTheme } from '@mui/material/styles';

interface Props {
    product: Product;
    onDelete?: (id: number) => void;
    onEdit?: (id: number) => void;
}

const ProductCard = ({ product, onDelete, onEdit }: Props) => {
    const theme = useTheme();

    const handleEditClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onEdit?.(product.id);
    };

    const handleDeleteClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onDelete?.(product.id);
    };

    return (
        <Card
            elevation={2}
            sx={{
                display: "flex",
                flexDirection: "column",
                height: '100%',
                borderRadius: theme.shape.borderRadius * 1.5,
                transition: "box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out",
                '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                    '& .product-card-actions': {
                        opacity: 1,
                    }
                }
            }}
        >
            <CardHeader
                title={
                    <Typography variant="h6" component="div" noWrap sx={{ fontWeight: 'medium' }}>
                        {product.name}
                    </Typography>
                }
                action={
                    <Box className="product-card-actions" sx={{ opacity: {xs: 1, md: 0}, transition: 'opacity 0.2s'}}>
                        <Tooltip title="Bearbeiten">
                            <IconButton size="small" onClick={handleEditClick}><EditIcon fontSize="small" /></IconButton>
                        </Tooltip>
                        <Tooltip title="Löschen">
                            <IconButton size="small" onClick={handleDeleteClick}><DeleteIcon color="error" fontSize="small" /></IconButton>
                        </Tooltip>
                    </Box>
                }
                sx={{ pb: 0 }}
            />
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

            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', pt: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="baseline" mb={1.5}>
                    <Typography variant="h6" component="div" color="text.primary">
                        {product.price.toFixed(2)} €
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {product.weight} kg
                    </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, flexGrow: 1 }}>
                    {product.description || 'Keine Beschreibung verfügbar.'}
                </Typography>

                {product.container && (
                    <Chip
                        label={`Behälter: ${product.container.type}`}
                        size="small"
                        variant="outlined"
                        sx={{ alignSelf: 'flex-start' }}
                    />
                )}
            </CardContent>
        </Card>
    );
};

export default ProductCard;