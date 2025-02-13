import { useState, ChangeEvent } from "react";
import { Typography } from "@mui/material";
import AddButton from "../../core/ui/AddButton.tsx";
import DeleteConfirmationDialog from "../../core/ui/DeleteConfirmationDialog.tsx";
import VehicleDialog from "./VehicleDialog.tsx";
import VehicleCards from "./VehicleCards.tsx";
import { Vehicle } from "../../domain/Vehicle.ts";
import { VehicleStatus } from "../../domain/enums/VehicleStatus.ts";
import {vehicle1, vehicle2, vehicle3, vehicle4} from "../../domain/ExampleData.ts";

const defaultVehicle: Vehicle = {
    id: -1,
    licensePlate: "",
    capacity: 0,
    status: VehicleStatus.Verfuegbar
};

const defaultVehicles = [
    vehicle1, vehicle2, vehicle3, vehicle4
]

function VehicleList() {
    const [vehicles, setVehicles] = useState<Vehicle[]>(defaultVehicles);
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
        let updatedVehicle = newVehicle;
        if (newVehicle.id === -1) {
            updatedVehicle = { ...newVehicle, id: Math.max(...vehicles.map(v => v.id), 0) + 1 };
        }

        setVehicles((prevVehicles) => {
            if (edit) {
                return prevVehicles.map(v => v.id === updatedVehicle.id ? updatedVehicle : v);
            }
            return [...prevVehicles, updatedVehicle];
        });

        setOpen(false);
        setEdit(false);
        setNewVehicle(defaultVehicle);
    };

    const handleStatusChange = (status: VehicleStatus) => {
        setNewVehicle({ ...newVehicle, status });
    };

    const handleAdd = () => {
        setOpen(true);
    };

    const handleDeleteButtonClicked = (id: number) => {
        setDeleteConfirm(true);
        setVehicleToDelete(id);
    };

    const handleDelete = () => {
        if (vehicleToDelete !== null) {
            setVehicles(vehicles.filter(v => v.id !== vehicleToDelete));
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
                onStatusChange={handleStatusChange}
            />

            <DeleteConfirmationDialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)} onConfirm={handleDelete} />
        </>
    );
}

export default VehicleList;
