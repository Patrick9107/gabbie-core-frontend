import axios from "axios";
import { Vehicle } from "../../domain/Vehicle.ts";
import { API_BASE_URL } from "../../../apiConfig.ts";

const VEHICLES_URL = `${API_BASE_URL}/Vehicle`;

export const fetchVehicles = async (): Promise<Vehicle[]> => {
    try {
        const response = await axios.get<Vehicle[]>(VEHICLES_URL);
        return response.data;
    } catch (error) {
        handleError(error);
        return [];
    }
};

export const fetchVehicleById = async (id: number): Promise<Vehicle | null> => {
    try {
        const response = await axios.get<Vehicle>(`${VEHICLES_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching Vehicle with ID ${id}: ${error}`);
    }
};

export const createVehicle = async (Vehicle: Vehicle): Promise<Vehicle> => {
    try {
        const { id: _id, ...cleanVehicle } = Vehicle;
        const response = await axios.post<Vehicle>(VEHICLES_URL, cleanVehicle);
        return response.data;
    } catch (error) {
        throw new Error(`Error creating Vehicle: ${axios.isAxiosError(error) ? error.response?.data?.message || error.message : error}`);
    }
};

export const updateVehicle = async (Vehicle: Vehicle): Promise<Vehicle> => {
    try {
        const { id, ...cleanVehicle } = Vehicle;
        const response = await axios.put<Vehicle>(`${VEHICLES_URL}/${id}`, cleanVehicle);
        return response.data;
    } catch (error) {
        throw new Error(`Error updating Vehicle with ID ${Vehicle.id}: ${axios.isAxiosError(error) ? error.response?.data?.message || error.message : error}`);
    }
};

export const deleteVehicle = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${VEHICLES_URL}/${id}`);
    } catch (error) {
        throw new Error(`Error deleting Vehicle with ID ${id}: ${error}`);
    }
};

const handleError = (error: unknown): never => {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? 'Unknown';
        const message = error.response?.data?.message ?? error.message;
        throw new Error(`Error ${status}: ${message}`);
    }
    throw new Error(`Unexpected error: ${error}`);
};