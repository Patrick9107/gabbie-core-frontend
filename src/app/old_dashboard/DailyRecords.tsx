import { Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const records = [
    { date: "19 Feb 2024", category: "Sales", value: "€1,200" },
    { date: "20 Feb 2024", category: "Expenses", value: "€500" },
    { date: "21 Feb 2024", category: "Profit", value: "€700" },
    { date: "22 Feb 2024", category: "Refunds", value: "€200" },
    { date: "23 Feb 2024", category: "Sales", value: "€1,500" },
    { date: "24 Feb 2024", category: "Expenses", value: "€600" },
];

function DailyRecords() {
    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6">Tagesaufzeichnungen</Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Datum</TableCell>
                        <TableCell>Kategorie</TableCell>
                        <TableCell>Betrag</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {records.map((record, index) => (
                        <TableRow key={index}>
                            <TableCell>{record.date}</TableCell>
                            <TableCell>{record.category}</TableCell>
                            <TableCell>{record.value}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}

export default DailyRecords;