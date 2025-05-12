import * as XLSX from "xlsx";
import { Button } from "@mui/material";

interface Props {
    routeData: string;
}

export default function ExportLadelisteButton({ routeData }: Props) {
    const handleExport = () => {
        try {
            const parsed = JSON.parse(routeData);
            const rawStops = parsed.rawStops?.slice(1) || [];

            const allProductNames = new Set<string>();
            const productWeights: Record<string, number> = {};

            rawStops.forEach((stop: any) => {
                (stop.order?.orderItems || []).forEach((item: any) => {
                    allProductNames.add(item.product.name);
                    productWeights[item.product.name] = item.product.weight || 0;
                });
            });

            const productList = Array.from(allProductNames);
            const rows: any[] = [];

            rawStops.forEach((stop: any) => {
                const row: any = {};

                let totalWeight = 0;

                productList.forEach((productName) => {
                    row[productName] = 0;
                });

                (stop.order?.orderItems || []).forEach((item: any) => {
                    const name = item.product.name;
                    const quantity = item.quantity;
                    const weight = item.product.weight || 0;
                    const total = quantity * weight;
                    row[name] = total;
                    totalWeight += total;
                });

                row["Gesamtgewicht (kg)"] = totalWeight;
                rows.push(row);
            });

            // Gesamtzeile für alle Produkte
            const sumRow: any = {};
            productList.forEach((name) => {
                sumRow[name] = rows.reduce((acc, row) => acc + (row[name] || 0), 0);
            });
            sumRow["Gesamtgewicht (kg)"] = rows.reduce((acc, row) => acc + (row["Gesamtgewicht (kg)"] || 0), 0);
            rows.push(sumRow);

            const worksheet = XLSX.utils.json_to_sheet(rows);

            worksheet["!cols"] = [
                ...productList.map(() => ({ wch: 18 })), // Produktspalten
                { wch: 20 }, // Gesamtgewicht
            ];

            // Erste Zeile formatieren
            const range = XLSX.utils.decode_range(worksheet["!ref"]!);
            for (let col = range.s.c; col <= range.e.c; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
                const cell = worksheet[cellAddress];
                if (cell) {
                    cell.s = {
                        font: { bold: true, sz: 16 },
                    };
                }
            }

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Ladeliste");

            XLSX.writeFile(workbook, "Ladeliste.xlsx");
        } catch (error) {
            console.error("Fehler beim Exportieren der Ladeliste:", error);
        }
    };

    return (
        <Button variant="contained" color="secondary" onClick={handleExport}>
            Ladeliste exportieren
        </Button>
    );
}
