import * as XLSX from "xlsx";
import { Button } from "@mui/material";

interface Props {
    routeData: string;
}

export default function ExportToExcelButton({ routeData }: Props) {
    const handleExport = () => {
        try {
            const parsed = JSON.parse(routeData);
            const rawStops = parsed.rawStops?.slice(1) || []; // Das ist nur da damit Reisenberg nicht drauf ist

            const allProductNames = new Set<string>();

            rawStops.forEach((stop: any) => {
                (stop?.order?.orderItems || []).forEach((item: any) => {
                    allProductNames.add(item.product.name);
                });
            });

            const productList = Array.from(allProductNames);

            const rows = rawStops.map((stop: any) => {
                const row: any = {
                    Adresse: stop.order?.address || "",
                    Telefonnummer: stop.order?.phoneNumber || "",
                    Notiz: stop.order?.note || "",
                    Lieferdatum: stop.order?.deliveryDate?.split("T")[0] || "",
                };

                productList.forEach((productName) => {
                    row[productName] = 0;
                });

                (stop?.order?.orderItems || []).forEach((item: any) => {
                    const name = item.product.name;
                    row[name] = item.quantity;
                });

                return row;
            });

            const worksheet = XLSX.utils.json_to_sheet(rows);

            // ⬆ Spaltenbreiten
            const columnWidths = [
                { wch: 30 }, // Adresse
                { wch: 15 }, // Telefonnummer
                ...productList.map(() => ({ wch: 12 })), // Produkte
                { wch: 25 }, // Notiz
                { wch: 15 }, // Lieferdatum
            ];

            worksheet["!cols"] = columnWidths;
            
            const headerRange = XLSX.utils.decode_range(worksheet["!ref"]!);
            for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
                const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
                const cell = worksheet[cellAddress];
                if (cell) {
                    cell.s = {
                        font: { bold: true },
                    };
                }
            }

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "RouteExport");

            XLSX.writeFile(workbook, "Routenliste.xlsx");
        } catch (error) {
            console.error("Fehler beim Exportieren:", error);
        }
    };

    return (
        <Button variant="contained" color="success" onClick={handleExport}>
            Excel Export
        </Button>
    );
}
