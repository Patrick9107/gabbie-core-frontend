import { OrderResponse } from '../../domain/OrderResponse.ts';
import { Paper, Table, TableHead, TableRow, TableCell, TableBody, SxProps } from '@mui/material';
import { useMemo } from 'react';

interface Props {
  orders: OrderResponse[];
  sxCustom?: SxProps;
}

const OrderOverview = ({ orders, sxCustom }: Props) => {
  const productSummary = useMemo(() => {
    const summary: Record<string, number> = {};
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        const productName = item.product.name;
        summary[productName] = (summary[productName] || 0) + item.quantity;
      })
    })
    return summary;
  }, [orders]);

  return (
    <Paper sx={{...sxCustom, overflow: "hidden", borderRadius: "12px", boxShadow: 3, p: 2, maxWidth: "30rem" }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Produkt</TableCell>
            <TableCell>Gesamtmenge</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(productSummary).map(([productName, quantity]) => (
            <TableRow key={productName}>
              <TableCell>{productName}</TableCell>
              <TableCell>{quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default OrderOverview;