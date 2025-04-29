
import ContainerCards from "./ContainerCards.tsx";
import { Typography } from "@mui/material";
import AddButton from "../../core/ui/AddButton.tsx";
import { ChangeEvent, useEffect, useState } from "react";
import { Container } from "../../domain/Container.ts";
import ContainerDialog from "./ContainerDialog.tsx";
import DeleteConfirmationDialog from "../../core/ui/DeleteConfirmationDialog.tsx";
import {createContainer, fetchContainers, updateContainer, deleteContainer} from '../../infra/api/containerService.ts';

const defaultContainer = {
    id: -1,
    type: "",
    depositAmount: 0
}


function ListContainers() {
    const [containers, setContainers] = useState<Container[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [newContainer, setNewContainer] = useState<Container>(defaultContainer);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [containerToDelete, setContainerToDelete] = useState<number | null>(null);

    // Fetch containers on mount
    useEffect(() => {
        fetchContainers().then(setContainers).catch(console.error);
        document.title = "Behälter";
    }, []);

    const handleClose = () => {
        setOpen(false);
        setEdit(false);
        setNewContainer(defaultContainer);
    }

    const handleSubmit = async () => {
        try {
            let updatedContainer: Container;
            if (edit) {
                updatedContainer = await updateContainer(newContainer);
                setContainers((prevContainers) => prevContainers.map(c => c.id === updatedContainer.id ? updatedContainer : c));
            } else {
                updatedContainer = await createContainer(newContainer);
                setContainers((prevContainers) => [...prevContainers, updatedContainer]);
            }

            handleClose();
        } catch (error) {
            console.error(error);
        }
    }

    // const handleContainerChange = (containerId: number | null) => {
    //     const foundContainer = containers.find(c => c.id === containerId) ?? null;
    //     setNewContainer({ ...newContainer, container: foundContainer });
    // };

    const handleAdd = () => {
        setOpen(true);
    }

    const handleDeleteButtonClicked = (id: number) => {
        setDeleteConfirm(true);
        setContainerToDelete(id);
    }

    const handleDelete = async () => {
        if (containerToDelete) {
            try {
                await deleteContainer(containerToDelete);
                setContainers((prevContainers) => prevContainers.filter(c => c.id !== containerToDelete));
            } catch (error) {
                console.error(error);
            }
            setDeleteConfirm(false);
            setContainerToDelete(null);
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewContainer({ ...newContainer, [e.target.name]: e.target.value });
    };

    const handleEdit = (id: number) => {
        const editableContainer = containers.find((container) => container.id === id);
        if (editableContainer) {
            setNewContainer(editableContainer);
        } else {
            console.error("Container not found!");
        }
        setEdit(true);
        setOpen(true);
    }

    return (
        <>
            <Typography sx={{ fontWeight: "bold" }} variant="h4" gutterBottom> Behälterübersicht </Typography>
            <AddButton onClick={handleAdd}/>
            <ContainerCards containers={containers} onDelete={handleDeleteButtonClicked} onEdit={handleEdit}/>

            <ContainerDialog
                open={isOpen}
                edit={edit}
                container={newContainer}
                onClose={handleClose}
                onSubmit={handleSubmit}
                onChange={handleChange}
            />

            <DeleteConfirmationDialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)} onConfirm={handleDelete}/>
        </>
    );
}

export default ListContainers;