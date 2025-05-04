import { OrderResponse } from '../../domain/OrderResponse.ts';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, SxProps, Typography, TableContainer, Box } from '@mui/material';
import { useMemo } from 'react';
import InventoryIcon from '@mui/icons-material/Inventory';

interface Props {
  orders: OrderResponse[];
  sxCustom?: SxProps;
}

const OrderOverview = ({ orders, sxCustom }: Props) => {
  const productSummary = useMemo(() => {
    const summary: Record<string, number> = {};
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (item.product) {
          const productName = item.product.name;
          summary[productName] = (summary[productName] || 0) + item.quantity;
        }
      })
    })
    return Object.entries(summary)
        .sort(([, quantA], [, quantB]) => quantB - quantA)
        .reduce((obj, [key, val]) => {
          obj[key] = val;
          return obj;
        }, {} as Record<string, number>);
  }, [orders]);

  return (
      <Paper sx={{
        ...sxCustom,
        overflow: "hidden",
        borderRadius: "12px",
        boxShadow: 3,
        p: 2,
        maxWidth: "30rem"
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <InventoryIcon sx={{ color: '#3d9970', mr: 1 }}/>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'medium' }}>
            Produktzusammenfassung
          </Typography>
        </Box>
        <TableContainer sx={{ maxHeight: 300 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow sx={{ '& th': { backgroundColor: (theme) => theme.palette.grey[200], fontWeight: 'bold' } }}>
                <TableCell>Produkt</TableCell>
                <TableCell align="right">Gesamtmenge</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(productSummary).length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <Typography variant="body2" color="textSecondary" sx={{py: 2}}>
                        Keine Produkte in den Bestellungen gefunden.
                      </Typography>
                    </TableCell>
                  </TableRow>
              ) : (
                  Object.entries(productSummary).map(([productName, quantity]) => (
                      <TableRow key={productName} hover>
                        <TableCell component="th" scope="row">{productName}</TableCell>
                        <TableCell align="right">{quantity}</TableCell>
                      </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
  );
};

export default OrderOverview;