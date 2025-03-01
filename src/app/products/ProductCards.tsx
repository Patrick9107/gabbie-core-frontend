import { Button, Card, CardContent, CardHeader, CardMedia, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Product } from "../../domain/Product.ts";

interface Props {
  products: Product[];
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

function ProductCards({ products, onDelete, onEdit }: Props) {
  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {products.map((product) => (
          <Card
            key={product.id}
            sx={{
              width: 290,
              height: 340,
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
              boxShadow: 3,
              transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition
              "&:hover": {
                transform: "scale(1.05)", // Slightly scale up on hover
                boxShadow: 6, // Increase shadow on hover
              },
            }}
          >
            <CardHeader
              title={product.name}
              sx={{ textAlign: "center", fontWeight: "bold", paddingBottom: 0 }}
            />
            <CardMedia
              component="img"
              image={product.imageUrl || "placeholder.svg"}
              sx={{ height: 180, objectFit: "contain", padding: theme => theme.spacing(2) }} // Using theme spacing
            />
            <CardContent sx={{ display: "flex", gap: theme => theme.spacing(1.25), mt: "auto", justifyContent: "center" }}>
              <Button onClick={() => onEdit(product.id)} variant="contained" startIcon={<EditIcon />} sx={{ fontSize: "0.8rem" }}>
                Bearbeiten
              </Button>
              <Button onClick={() => onDelete(product.id)} variant="contained" color="error" startIcon={<DeleteIcon />} sx={{ fontSize: "0.8rem" }}>
                Löschen
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default ProductCards;