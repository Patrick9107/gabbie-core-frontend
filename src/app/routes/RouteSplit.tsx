import React, { useState, useEffect } from "react";
import { CircularProgress, Typography, Box, Paper, List, ListItem, ListItemText, IconButton, TextField } from "@mui/material";
import { handleGetRoute } from './RouteUtils.tsx';
import { Stop } from "../../domain/Stop.ts";
import { Order } from "../../domain/Order.ts";
import SaveRoute from "./SaveRoute";
import DetailsDialog from "./AddressDetails.tsx";
import BillingDialog from "./BillingDialogue.tsx";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import { format, addMinutes } from 'date-fns';
import { de } from 'date-fns/locale';

interface RouteSplitProps {
    orders: Order[];
    fixedStartAddress: string;
}

const RouteSplit: React.FC<RouteSplitProps> = ({ orders, fixedStartAddress }) => {
    const [day1Routes, setDay1Routes] = useState<Stop[]>([]);
    const [day2Routes, setDay2Routes] = useState<Stop[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [billingDialogOpen, setBillingDialogOpen] = useState(false);
    const [startTimeDay1, setStartTimeDay1] = useState<string>("08:00"); // Default Startzeit
    const [startTimeDay2, setStartTimeDay2] = useState<string>("08:00"); // Default Startzeit

    const handleOpenDetailsDialog = (stop: Stop) => {
        setSelectedStop(stop);
        setDetailsDialogOpen(true);
    };

    const handleCloseDetailsDialog = () => {
        setDetailsDialogOpen(false);
    };

    const handleOpenBillingDialog = (stop: Stop) => {
        setSelectedStop(stop);
        setBillingDialogOpen(true);
    };

    const handleCloseBillingDialog = () => {
        setBillingDialogOpen(false);
    };

    const splitRoutesWithoutOptimization = async () => {
        setLoading(true);
        try {
            const routeData = await handleGetRoute(orders, fixedStartAddress);
            const stops: Stop[] = routeData.rawStops;

            stops.sort((a, b) => a.distance - b.distance);
            const reisenbergStop = stops.find(stop => stop.name === "Reisenberg");
            if (!reisenbergStop) {
                throw new Error("Reisenberg not found in stops.");
            }

            const otherStops = stops.filter(stop => stop.name !== "Reisenberg");
            let day1: Stop[] = [reisenbergStop];
            let day2: Stop[] = [reisenbergStop];
            let totalDay1 = reisenbergStop.distance;
            let totalDay2 = reisenbergStop.distance;

            otherStops.forEach((stop) => {
                if (totalDay1 <= totalDay2) {
                    day1.push(stop);
                    totalDay1 += stop.distance;
                } else {
                    day2.push(stop);
                    totalDay2 += stop.distance;
                }
            });

            setDay1Routes(day1);
            setDay2Routes(day2);
        } catch (err) {
            console.error("Fehler bei der Aufteilung:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        splitRoutesWithoutOptimization();
    }, [orders, fixedStartAddress]);

    const getRelativeArrivalTime = (currentStop: Stop, previousStop: Stop | null): number => {
        if (!previousStop) {
            return currentStop.arrival;
        }
        return currentStop.arrival - previousStop.arrival;
    };

    const getRelativeDistance = (currentStop: Stop, previousStop: Stop | null): number => {
        if (!previousStop) {
            return currentStop.distance;
        }
        return currentStop.distance - previousStop.distance;
    };

    const calculateEstimatedTime = (startTime: string, arrivalTimeInMinutes: number, previousArrivalTime?: number): string => {
        try {
            const [startHours, startMinutes] = startTime.split(":").map(Number);
            let startDate = new Date();
            startDate.setHours(startHours);
            startDate.setMinutes(startMinutes);

            // Verwende die vorherige Ankunftszeit, falls vorhanden, sonst die Startzeit
            let baseTime = previousArrivalTime ? addMinutes(startDate, previousArrivalTime) : startDate;
            const arrivalTime = addMinutes(baseTime, arrivalTimeInMinutes);
            const lowerBound = format(addMinutes(arrivalTime, -60), 'HH:mm', { locale: de });
            const upperBound = format(addMinutes(arrivalTime, 60), 'HH:mm', { locale: de });
            return `${lowerBound} - ${upperBound}`;
        } catch (error) {
            console.error("Fehler beim Berechnen der geschätzten Zeit:", error);
            return "Zeit nicht verfügbar";
        }
    };

    return (
        <Box mt={3}>
            <Typography variant="h4" gutterBottom>
                Routenaufteilung
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                <Box>
                    <Paper sx={{ p: 2, mb: 2, borderRadius: "8px", boxShadow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                            Route für Samstag
                        </Typography>
                        <TextField
                            label="Startzeit Samstag"
                            type="time"
                            value={startTimeDay1}
                            onChange={(e) => setStartTimeDay1(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{ mb: 2 }}
                        />
                        <List>
                            {day1Routes.map((stop, index, array) => {
                                const relativeArrivalTime = getRelativeArrivalTime(stop, array[index - 1]);
                                const estimatedTime = calculateEstimatedTime(startTimeDay1, relativeArrivalTime, index > 0 ? getRelativeArrivalTime(array[index-1], array[0]) : 0);
                                return(
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <>
                                                <IconButton edge="end" aria-label="details" onClick={() => handleOpenDetailsDialog(stop)}>
                                                    <InfoOutlinedIcon />
                                                </IconButton>
                                                <IconButton edge="end" aria-label="billing" onClick={() => handleOpenBillingDialog(stop)}>
                                                    <ReceiptOutlinedIcon />
                                                </IconButton>
                                            </>
                                        }
                                    >
                                        <ListItemText
                                            primary={stop.name}
                                            secondary={`Distanz: ${getRelativeDistance(stop, array[index - 1]).toFixed(2)} km, Ankunft: ${estimatedTime} Uhr`}
                                        />
                                    </ListItem>
                                )})}
                        </List>
                        {day1Routes.length > 1 && (
                            // @ts-ignore
                            <SaveRoute routeData={{ rawStops: day1Routes }} routeStartTime={startTimeDay1}/>
                        )}
                    </Paper>

                    <Paper sx={{ p: 2, borderRadius: "8px", boxShadow: 1 }}>
                        <Typography variant="h6" gutterBottom>
                            Route für Sonntag
                        </Typography>
                        <TextField
                            label="Startzeit Sonntag"
                            type="time"
                            value={startTimeDay2}
                            onChange={(e) => setStartTimeDay2(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{ mb: 2 }}
                        />
                        <List>
                            {day2Routes.map((stop, index, array) => {
                                const relativeArrivalTime = getRelativeArrivalTime(stop, array[index - 1]);
                                const estimatedTime = calculateEstimatedTime(startTimeDay2, relativeArrivalTime, index > 0 ? getRelativeArrivalTime(array[index-1], array[0]) : 0);
                                return(
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <>
                                                <IconButton edge="end" aria-label="details" onClick={() => handleOpenDetailsDialog(stop)}>
                                                    <InfoOutlinedIcon />
                                                </IconButton>
                                                <IconButton edge="end" aria-label="billing" onClick={() => handleOpenBillingDialog(stop)}>
                                                    <ReceiptOutlinedIcon />
                                                </IconButton>
                                            </>
                                        }
                                    >
                                        <ListItemText
                                            primary={stop.name}
                                            secondary={`Distanz: ${getRelativeDistance(stop, array[index - 1]).toFixed(2)} km, Ankunft: ${estimatedTime} Uhr`}
                                        />
                                    </ListItem>
                                )})}
                        </List>
                        {day2Routes.length > 1 && (
                            // @ts-ignore
                            <SaveRoute routeData={{ rawStops: day2Routes }} routeStartTime={startTimeDay2}/>
                        )}
                    </Paper>
                </Box>
            )}

            {selectedStop && (
                <DetailsDialog open={detailsDialogOpen} handleClose={handleCloseDetailsDialog} stop={selectedStop} />
            )}

            {selectedStop && (
                <BillingDialog open={billingDialogOpen} handleClose={handleCloseBillingDialog} stop={selectedStop} />
            )}
        </Box>
    );
};

export default RouteSplit;

