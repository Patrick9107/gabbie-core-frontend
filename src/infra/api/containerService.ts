import axios from "axios";
import { Container } from "../../domain/Container.ts";
import { API_BASE_URL } from "../../../apiConfig.ts";

const CONTAINERS_URL = `${API_BASE_URL}/Container`;

export const fetchContainers = async (): Promise<Container[]> => {
  try {
    const response = await axios.get<Container[]>(CONTAINERS_URL);
    return response.data;
  } catch (error) {
    handleError(error);
    return [];
  }
};

export const fetchContainerById = async (id: number): Promise<Container | null> => {
  try {
    const response = await axios.get<Container>(`${CONTAINERS_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching container with ID ${id}: ${error}`);
  }
};

export const createContainer = async (container: Container): Promise<Container> => {
  try {
    const { id: _id, ...newContainer } = container;
    const response = await axios.post<Container>(CONTAINERS_URL, newContainer);
    return response.data;
  } catch (error) {
    throw new Error(`Error creating container: ${axios.isAxiosError(error) ? error.response?.data?.message || error.message : error}`);
  }
};

export const updateContainer = async (container: Container): Promise<Container> => {
  try {
    const response = await axios.put<Container>(`${CONTAINERS_URL}/${container.id}`, container);
    return response.data;
  } catch (error) {
    throw new Error(`Error updating container with ID ${container.id}: ${axios.isAxiosError(error) ? error.response?.data?.message || error.message : error}`);
  }
};

export const deleteContainer = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${CONTAINERS_URL}/${id}`);
  } catch (error) {
    throw new Error(`Error deleting container with ID ${id}: ${error}`);
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
