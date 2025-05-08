import { useState, ChangeEvent, useEffect, useCallback } from "react";
import { Vehicle } from "../../domain/Vehicle.ts";
import { VehicleStatus } from "../../domain/enums/VehicleStatus.ts";
import { fetchVehicles, createVehicle, deleteVehicle, updateVehicle } from "../../infra/api/vehicleService.ts";
import { Typography, Box, Alert, Snackbar, Stack, Button } from "@mui/material";
import AddButton from "../../core/ui/AddButton.tsx";
import DeleteConfirmationDialog from "../../core/ui/DeleteConfirmationDialog.tsx";
import VehicleDialog from "./VehicleDialog.tsx";
import VehicleCards from "./VehicleCards.tsx";
import AddressDialog from "../vehicle/VehicleAddressDialog.tsx";

const defaultVehicle: Vehicle = {
    id: -1,
    licensePlate: "",
    capacity: 0,
    status: VehicleStatus.Verfuegbar,
    routeId: 0
};

function VehicleList() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [newVehicle, setNewVehicle] = useState<Vehicle>(defaultVehicle);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' } | null>(null);
    const [selectedRouteId, setSelectedRouteId] = useState<number | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setApiError(null);
        try {
            const fetchedVehicles = await fetchVehicles();
            setVehicles(fetchedVehicles);
        } catch (err: any) {
            console.error("Fehler beim Laden der Fahrzeuge:", err);
            const errorMsg = err.message || "Fahrzeuge konnten nicht geladen werden.";
            setApiError(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
        document.title = "Fahrzeuge";
    }, [loadData]);

    const handleCloseSnackbar = () => {
        setSnackbar(null);
    };

    const resetDialogState = () => {
        setOpen(prevState => !prevState);
        setEdit(false);
        setNewVehicle(defaultVehicle);
        setApiError(null);
    };

    const handleSubmit = async () => {
        setApiError(null);
        // Add validation call here if needed, before API call
        // const isValid = validateVehicleForm(newVehicle); // Assuming validation function exists
        // if (!isValid) {
        //     setApiError("Bitte füllen Sie alle Pflichtfelder korrekt aus."); // Set error for dialog
        //     return;
        // }

        try {
            let responseVehicle: Vehicle;
            if (edit) {
                responseVehicle = await updateVehicle(newVehicle);
                setVehicles((prev) => prev.map(v => v.id === responseVehicle.id ? responseVehicle : v));
                setSnackbar({ open: true, message: 'Fahrzeug erfolgreich aktualisiert!', severity: 'success' });
            } else {
                responseVehicle = await createVehicle(newVehicle);
                setVehicles((prev) => [...prev, responseVehicle]);
                setSnackbar({ open: true, message: 'Fahrzeug erfolgreich erstellt!', severity: 'success' });
            }
            resetDialogState();
        } catch (error: any) {
            console.error("Fehler beim Speichern des Fahrzeugs:", error);
            const errorMsg = error.message || "Fahrzeug konnte nicht gespeichert werden.";
            setApiError(errorMsg);
            setSnackbar({ open: true, message: errorMsg, severity: 'error' });
        }
    };

    const handleAdd = () => {
        resetDialogState();
        setOpen(true);
    };

    const handleDeleteButtonClicked = (id: number) => {
        setDeleteConfirm(true);
        setVehicleToDelete(id);
        setApiError(null);
    };

    const handleDelete = async () => {
        if (vehicleToDelete !== null) {
            setApiError(null);
            try {
                await deleteVehicle(vehicleToDelete);
                setVehicles((prev) => prev.filter(v => v.id !== vehicleToDelete));
                setSnackbar({ open: true, message: 'Fahrzeug erfolgreich gelöscht!', severity: 'success' });
            } catch (error: any) {
                console.error("Fehler beim Löschen des Fahrzeugs:", error);
                const errorMsg = error.message || "Fahrzeug konnte nicht gelöscht werden.";
                setApiError(errorMsg);
                setSnackbar({ open: true, message: errorMsg, severity: 'error' });
            } finally {
                setDeleteConfirm(false);
                setVehicleToDelete(null);
            }
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newValue = name === 'capacity' ? parseInt(value, 10) || 0 : value;
        setNewVehicle({ ...newVehicle, [name]: newValue });
    };

    const handleEdit = (id: number) => {
        const editableVehicle = vehicles.find((vehicle) => vehicle.id === id);
        if (editableVehicle) {
            setNewVehicle(editableVehicle);
            setEdit(true);
            setOpen(true);
            setApiError(null);
        } else {
            console.error("Fahrzeug nicht gefunden!");
            setSnackbar({ open: true, message: "Das zu bearbeitende Fahrzeug wurde nicht gefunden.", severity: 'error' });
        }
    };

    const handleShowAddresses = (routeId: number) => {
        setSelectedRouteId(routeId);
    };

    const handleCloseAddressDialog = () => {
        setSelectedRouteId(null);
    };


    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} spacing={2}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    Fahrzeugverwaltung
                </Typography>
                <AddButton onClick={handleAdd} />
            </Stack>

            {loading ? (
                <VehicleCards isLoading={true} />
            ) : apiError && vehicles.length === 0 ? (
                <Alert severity="error" sx={{ my: 2 }}>{apiError}</Alert>
            ) : !loading && vehicles.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 6, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Noch keine Fahrzeuge angelegt.
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        Fügen Sie Ihr erstes Fahrzeug hinzu, um es hier zu sehen.
                    </Typography>
                    <Button variant="contained" onClick={handleAdd}>
                        Erstes Fahrzeug hinzufügen
                    </Button>
                </Box>
            ) : (
                <VehicleCards
                    vehicles={vehicles}
                    onDelete={handleDeleteButtonClicked}
                    onEdit={handleEdit}
                    onShowAddresses={handleShowAddresses}
                    isLoading={false}
                />
            )}

            <VehicleDialog
                open={isOpen}
                edit={edit}
                vehicle={newVehicle}
                onClose={resetDialogState}
                onSubmit={handleSubmit}
                onChange={handleChange}
            />

            <DeleteConfirmationDialog
                open={deleteConfirm}
                onClose={() => setDeleteConfirm(false)}
                onConfirm={handleDelete}
            />

            {selectedRouteId !== null && (
                <AddressDialog
                    open={selectedRouteId !== null}
                    onClose={handleCloseAddressDialog}
                    routeId={selectedRouteId}
                />
            )}

            {snackbar && (
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    );
}

export default VehicleList;