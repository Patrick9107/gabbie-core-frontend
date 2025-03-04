import React from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Grid } from "@mui/material";
import { Stop } from "../../domain/Stop.ts";

interface DetailsDialogProps {
    open: boolean;
    handleClose: () => void;
    stop: Stop;
}

const DetailsDialog: React.FC<DetailsDialogProps> = ({ open, handleClose, stop }) => {
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Stop Details</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Address:</Typography>
                        <Typography>{stop.order.address}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Products:</Typography>
                        {stop.order.orderItems && stop.order.orderItems.length > 0 ? (
                            stop.order.orderItems.map((orderItem, index) => (
                                <Typography key={index}>
                                    {orderItem.product.name}: {orderItem.quantity}
                                </Typography>
                            ))
                        ) : (
                            <Typography>No products available.</Typography>
                        )}
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Note:</Typography>
                        <Typography>{stop.order.note || "No note available."}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="h6">Phone Number:</Typography>
                        <Typography>{stop.order.phoneNumber || "No phone number available."}</Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DetailsDialog;
