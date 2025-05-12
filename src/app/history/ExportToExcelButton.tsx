import * as XLSX from "xlsx";
import { Button } from "@mui/material";

interface Props {
    routeData: string;
}

export default function ExportToExcelButton({ routeData }: Props) {
    const handleExport = () => {
        try {
            const parsed = JSON.parse(routeData);
            const rawStops = parsed.rawStops?.slice(1) || [];

            const rows = rawStops.map((stop: any) => {
                return {
                    Adresse: stop.order?.address || "",
                    Telefonnummer: stop.order?.phoneNumber || "",
                    Notiz: stop.order?.note || "",
                    Lieferdatum: stop.order?.deliveryDate?.split("T")[0] || "",
                };
            });

            const worksheet = XLSX.utils.json_to_sheet(rows);

            // Spaltenbreiten
            worksheet["!cols"] = [
                { wch: 30 }, // Adresse
                { wch: 15 }, // Telefonnummer
                { wch: 25 }, // Notiz
                { wch: 15 }, // Lieferdatum
            ];

            // Kopfzeile fett
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
            Routenliste Export
        </Button>
    );
}
