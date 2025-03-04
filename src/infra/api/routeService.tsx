import axios from "axios";
import { API_BASE_URL } from "../../../apiConfig.ts";

const ROUTES_URL = `${API_BASE_URL}/Route`;

export interface Route {
    id: number;
    name: string;
    vehicleId?: number;
    stops: { name: string; arrival: number; distance: number }[];
}

export const fetchRoutes = async (): Promise<Route[]> => {
    try {
        const response = await axios.get<Route[]>(ROUTES_URL);
        return response.data;
    } catch (error) {
        handleError(error);
        return [];
    }
};

export const fetchRouteById = async (id: number): Promise<Route | null> => {
    try {
        const response = await axios.get<Route>(`${ROUTES_URL}/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(`Error fetching route with ID ${id}: ${error}`);
    }
};

export const createRoute = async (route: Route): Promise<Route> => {
    try {
        const { id, ...newRoute } = route;
        const response = await axios.post<Route>(ROUTES_URL, newRoute);
        return response.data;
    } catch (error) {
        throw new Error(`Error creating route: ${axios.isAxiosError(error) ? error.response?.data?.message || error.message : error}`);
    }
};

export const updateRoute = async (route: Route): Promise<Route> => {
    try {
        const response = await axios.put<Route>(`${ROUTES_URL}/${route.id}`, route);
        return response.data;
    } catch (error) {
        throw new Error(`Error updating route with ID ${route.id}: ${axios.isAxiosError(error) ? error.response?.data?.message || error.message : error}`);
    }
};

export const deleteRoute = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${ROUTES_URL}/${id}`);
    } catch (error) {
        throw new Error(`Error deleting route with ID ${id}: ${error}`);
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