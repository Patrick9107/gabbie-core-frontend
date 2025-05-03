import axios from "axios";
import { Product } from "../../domain/Product.ts";
import { API_BASE_URL } from "../../../apiConfig.ts";

const PRODUCTS_URL = `${API_BASE_URL}/Product`;

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>(PRODUCTS_URL);
    return response.data;
  } catch (error) {
    handleError(error);
    return [];
  }
};

export const fetchProductById = async (id: number): Promise<Product | null> => {
  try {
    const response = await axios.get<Product>(`${PRODUCTS_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching product with ID ${id}: ${error}`);
    return null;
  }
};

export const createProduct = async (product: Product): Promise<Product> => {
  try {
    const { id: _id, container, ...newProduct } = product;
    const formattedProduct = {
      ...newProduct,
      containerId: container?.id ?? null
    }
    const response = await axios.post<Product>(PRODUCTS_URL, formattedProduct);
    return response.data;
  } catch (error) {
    throw new Error(`Error creating product: ${axios.isAxiosError(error) ? error.response?.data?.message || error.message : error}`);
  }
};

export const updateProduct = async (product: Product): Promise<Product> => {
  try {
    const { id, container, ...newProduct } = product;
    const formattedProduct = {
      ...newProduct,
      containerId: container?.id ?? null
    }
    const response = await axios.put<Product>(`${PRODUCTS_URL}/${id}`, formattedProduct);
    return response.data;
  } catch (error) {
    throw new Error(`Error updating product with ID ${product.id}: ${axios.isAxiosError(error) ? error.response?.data?.message || error.message : error}`);
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${PRODUCTS_URL}/${id}`);
  } catch (error) {
    throw new Error(`Error deleting product with ID ${id}: ${error}`);
  }
};

export const fetchOrderedProductStats = async (): Promise<{ productId: number; productName: string; count: number }[]> => {
  try {
    const response = await axios.get(`${PRODUCTS_URL}/order-counts`);
    return response.data;
  } catch (error) {
    throw new Error(
        `Error fetching ordered product stats: ${
            axios.isAxiosError(error)
                ? error.response?.data?.message || error.message
                : String(error)
        }`
    );
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
