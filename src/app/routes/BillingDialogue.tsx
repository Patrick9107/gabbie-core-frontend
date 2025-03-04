import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from "@mui/material";
import { Stop } from "../../domain/Stop.ts";

interface BillingDialogProps {
    open: boolean;
    handleClose: () => void;
    stop: Stop;
}

const BillingDialog: React.FC<BillingDialogProps> = ({ open, handleClose, stop }) => {
    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Billing Details</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Products:</Typography>
                        {stop.order.orderItems && stop.order.orderItems.length > 0 ? (
                            stop.order.orderItems.map((orderItem, index) => (
                                <Typography key={index}>
                                    {orderItem.product.name}: {orderItem.quantity} Stück - €{(orderItem.quantity * orderItem.product.price).toFixed(2)}
                                </Typography>
                            ))
                        ) : (
                            <Typography>No products available.</Typography>
                        )}
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default BillingDialog;
