import { ChangeEvent, useEffect, useState, useCallback } from "react";
import { Container } from "../../domain/Container.ts";
import { createContainer, fetchContainers, updateContainer, deleteContainer } from '../../infra/api/containerService.ts';
import { Typography, Box, Alert, Snackbar, Stack, Button } from "@mui/material";
import AddButton from "../../core/ui/AddButton.tsx";
import ContainerDialog from "./ContainerDialog.tsx";
import DeleteConfirmationDialog from "../../core/ui/DeleteConfirmationDialog.tsx";
import ContainerCards from "./ContainerCards.tsx";

const defaultContainer: Container = {
    id: -1,
    type: "",
    depositAmount: 0
};

function ListContainers() {
    const [containers, setContainers] = useState<Container[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [newContainer, setNewContainer] = useState<Container>(defaultContainer);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [containerToDelete, setContainerToDelete] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' } | null>(null);

    const loadData = useCallback(async () => {
        setLoading(true);
        setApiError(null);
        try {
            const fetchedContainers = await fetchContainers();
            setContainers(fetchedContainers);
        } catch (err: any) {
            console.error("Fehler beim Laden der Behälter:", err);
            const errorMsg = err.message || "Behälter konnten nicht geladen werden.";
            setApiError(errorMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
        document.title = "Behälter";
    }, [loadData]);

    const handleCloseSnackbar = () => {
        setSnackbar(null);
    };

    const resetDialogState = () => {
        setOpen(false);
        setEdit(false);
        setNewContainer(defaultContainer);
        setApiError(null);
    }

    const handleSubmit = async () => {
        setApiError(null);
        try {
            let responseContainer: Container;
            if (edit) {
                responseContainer = await updateContainer(newContainer);
                setContainers((prevContainers) => prevContainers.map(c => c.id === responseContainer.id ? responseContainer : c));
                setSnackbar({ open: true, message: 'Behälter erfolgreich aktualisiert!', severity: 'success' });
            } else {
                responseContainer = await createContainer(newContainer);
                setContainers((prevContainers) => [...prevContainers, responseContainer]);
                setSnackbar({ open: true, message: 'Behälter erfolgreich erstellt!', severity: 'success' });
            }
            resetDialogState();
        } catch (error: any) {
            console.error("Fehler beim Speichern des Behälters:", error);
            const errorMsg = error.message || "Behälter konnte nicht gespeichert werden.";
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
        setContainerToDelete(id);
        setApiError(null);
    };

    const handleDelete = async () => {
        if (containerToDelete !== null) {
            setApiError(null);
            try {
                await deleteContainer(containerToDelete);
                setContainers((prevContainers) => prevContainers.filter(c => c.id !== containerToDelete));
                setSnackbar({ open: true, message: 'Behälter erfolgreich gelöscht!', severity: 'success' });
            } catch (error: any) {
                console.error("Fehler beim Löschen des Behälters:", error);
                const errorMsg = error.message || "Behälter konnte nicht gelöscht werden.";
                setApiError(errorMsg);
                setSnackbar({ open: true, message: errorMsg, severity: 'error' });
            } finally {
                setDeleteConfirm(false);
                setContainerToDelete(null);
            }
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newValue = name === 'depositAmount' ? parseFloat(value) || '' : value;
        setNewContainer({ ...newContainer, [name]: newValue });
    };

    const handleEdit = (id: number) => {
        const editableContainer = containers.find((container) => container.id === id);
        if (editableContainer) {
            setNewContainer(editableContainer);
            setEdit(true);
            setOpen(true);
            setApiError(null);
        } else {
            console.error("Container not found for editing!");
            const errorMsg = "Der zu bearbeitende Behälter wurde nicht gefunden.";
            setSnackbar({ open: true, message: errorMsg, severity: 'error' });
        }
    };

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3} spacing={2}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    Behälterverwaltung
                </Typography>
                <AddButton onClick={handleAdd} />
            </Stack>

            {loading ? (
                <ContainerCards isLoading={true} />
            ) : apiError && containers.length === 0 ? (
                <Alert severity="error" sx={{ my: 2 }}>{apiError}</Alert>
            ) : !loading && containers.length === 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 6, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        Noch keine Behälter angelegt.
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        Fügen Sie Ihren ersten Behälter hinzu, um ihn hier zu sehen.
                    </Typography>
                    <Button variant="contained" onClick={handleAdd}>
                        Ersten Behälter hinzufügen
                    </Button>
                </Box>
            ) : (
                <ContainerCards containers={containers} onDelete={handleDeleteButtonClicked} onEdit={handleEdit} isLoading={false}/>
            )}

            <ContainerDialog
                open={isOpen}
                edit={edit}
                container={newContainer}
                onClose={resetDialogState}
                onSubmit={handleSubmit}
                onChange={handleChange}
                apiError={apiError}
                clearApiError={() => setApiError(null)}
            />

            <DeleteConfirmationDialog
                open={deleteConfirm}
                onClose={() => setDeleteConfirm(false)}
                onConfirm={handleDelete}
            />

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

export default ListContainers;