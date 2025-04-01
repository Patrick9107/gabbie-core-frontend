import { useEffect, useState } from "react";
import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { fetchOrders } from "../../infra/api/orderService.ts";
import { OrderResponse } from "../../domain/OrderResponse.ts";

interface DailyTotal {
    date: string;
    total: number;
}

function DailyRecords() {
    const [dailyTotals, setDailyTotals] = useState<DailyTotal[]>([]);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const fetchedOrders: OrderResponse[] = await fetchOrders();

                // Gruppierung nach Datum und Summierung des Umsatzes
                const totalsMap = fetchedOrders.reduce((acc, order) => {
                    if (order.totalAmount !== null && order.createdAt) {
                        const dateKey = new Date(order.createdAt).toISOString().split("T")[0]; // Datum extrahieren
                        acc[dateKey] = (acc[dateKey] || 0) + order.totalAmount;
                    }
                    return acc;
                }, {} as Record<string, number>);

                // Umwandlung in Array für die Tabelle
                const dailyTotalsArray = Object.entries(totalsMap)
                    .map(([date, total]) => ({ date, total }))
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Neueste zuerst
                    .slice(0, 3); // Nur die letzten 3 Tage

                setDailyTotals(dailyTotalsArray);
            } catch (error) {
                console.error("Fehler beim Laden der Bestellungen:", error);
            }
        };

        loadOrders();
    }, []);

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Tägliche Umsätze (Letzte 3 Tage)</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Datum</TableCell>
                        <TableCell>Kategorie</TableCell>
                        <TableCell>Summe (€)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dailyTotals.map(({ date, total }, index) => (
                        <TableRow key={index}>
                            <TableCell>{new Date(date).toLocaleDateString("de-DE")}</TableCell>
                            <TableCell>Einnahmen</TableCell>
                            <TableCell>{total.toFixed(2)}€</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default DailyRecords;
