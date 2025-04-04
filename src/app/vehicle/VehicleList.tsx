import {useState, ChangeEvent, useEffect} from "react";
import { Typography } from "@mui/material";
import AddButton from "../../core/ui/AddButton.tsx";
import DeleteConfirmationDialog from "../../core/ui/DeleteConfirmationDialog.tsx";
import VehicleDialog from "./VehicleDialog.tsx";
import VehicleCards from "./VehicleCards.tsx";
import { Vehicle } from "../../domain/Vehicle.ts";
import { VehicleStatus } from "../../domain/enums/VehicleStatus.ts";
import {fetchVehicles, createVehicle, deleteVehicle, updateVehicle} from "../../infra/api/vehicleService.ts";

const defaultVehicle: Vehicle = {
    id: -1,
    licensePlate: "",
    capacity: 0,
    status: VehicleStatus.Verfuegbar,
    routeId: 0
};

function VehicleList() {

    useEffect(() => {
        const loadVehicles = async () => {
            try {
                const fetchedVehicles = await fetchVehicles();
                setVehicles(fetchedVehicles);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        };

        loadVehicles();
        document.title = "Fahrzeuge";
    }, []);

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [newVehicle, setNewVehicle] = useState<Vehicle>(defaultVehicle);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);

    const handleClose = () => {
        setOpen(false);
        setEdit(false);
        setNewVehicle(defaultVehicle);
    };

    const handleSubmit = () => {

        if (!edit) {
            createVehicle(newVehicle).then(response => setVehicles(prevState => [...prevState, response]));
        } else {
            updateVehicle(newVehicle).then(response => setVehicles(prevState =>
                prevState.map(vehicle => vehicle.id === response.id ? response : vehicle)
            ));
        }

        setOpen(false);
        setEdit(false);
        setNewVehicle(defaultVehicle);
    };

    const handleAdd = () => {
        setOpen(true);
    };

    const handleDeleteButtonClicked = (id: number) => {
        setDeleteConfirm(true);
        setVehicleToDelete(id);
    };

    const handleDelete = () => {
        if (vehicleToDelete) {
            deleteVehicle(vehicleToDelete).then(() => setVehicles(prevState => prevState.filter(o => o.id !== vehicleToDelete)));
            setDeleteConfirm(false);
            setVehicleToDelete(null);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewVehicle({ ...newVehicle, [e.target.name]: e.target.value });
    };

    const handleEdit = (id: number) => {
        const editableVehicle = vehicles.find((vehicle) => vehicle.id === id);
        if (editableVehicle) {
            setNewVehicle(editableVehicle);
        } else {
            console.error("Fahrzeug nicht gefunden!");
        }
        setEdit(true);
        setOpen(true);
    };

    return (
        <>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" gutterBottom> Fahrzeugübersicht </Typography>
            <AddButton onClick={handleAdd} />
            <VehicleCards vehicles={vehicles} onDelete={handleDeleteButtonClicked} onEdit={handleEdit} />

            <VehicleDialog
                open={isOpen}
                edit={edit}
                vehicle={newVehicle}
                onClose={handleClose}
                onSubmit={handleSubmit}
                onChange={handleChange}
            />

            <DeleteConfirmationDialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)} onConfirm={handleDelete} />
        </>
    );
}

export default VehicleList;
