import axios from "axios";
import { Order } from "../../domain/Order.ts";
import { API_BASE_URL } from "../../../apiConfig.ts";

const ORDERS_URL = `${API_BASE_URL}/Order`;

export const fetchOrders = async (): Promise<Order[]> => {
    try {
        const response = await axios.get<Order[]>(ORDERS_URL);
        console.log(response.data); // Debugging
        return response.data.map((order) => ({
            ...order,
            deliveryDate: order.deliveryDate && new Date(order.deliveryDate),
            deliveryTimeWindowStart: order.deliveryWindowStartDate && new Date(order.deliveryWindowStartDate),
            deliveryTimeWindowEnd: order.deliveryWindowEndDate && new Date(order.deliveryWindowEndDate),
        }));
    } catch (error) {
        handleError(error);
        return [];
    }
};

export const fetchOrderById = async (id: number): Promise<Order | null> => {
    try {
        const response = await axios.get<Order>(`${ORDERS_URL}/${id}`);
        return {
            ...response.data,
            deliveryDate: response.data.deliveryDate && new Date(response.data.deliveryDate),
            deliveryWindowStartDate: response.data.deliveryWindowStartDate && new Date(response.data.deliveryWindowStartDate),
            deliveryWindowEndDate: response.data.deliveryWindowEndDate && new Date(response.data.deliveryWindowEndDate),
        };
    } catch (error) {
        throw new Error(`Error fetching order with ID ${id}: ${error}`);
        return null;
    }
};

export const createOrder = async (order: Order): Promise<Order> => {
    try {
        const {id: _id, totalAmount: _totalAmount, ...cleanOrder } = order;
        const formattedOrderItems = cleanOrder.orderItems.map(item => ({ productId: item.product.id, quantity: item.quantity }));
        const newOrder = {
            ...cleanOrder,
            orderItems: formattedOrderItems,
            orderStatus: order.orderStatus
        }
        console.log(newOrder);
        const response = await axios.post<Order>(ORDERS_URL, newOrder);
        return response.data;
    } catch (error) {
        throw new Error(`Error creating order: ${axios.isAxiosError(error) ? error.response?.data?.message || error.message : error}`);
    }
};

export const updateOrder = async (order: Order): Promise<Order> => {
    try {
        console.log(order);
        const {id, totalAmount: _totalAmount, ...cleanOrder } = order;
        const formattedOrderItems = cleanOrder.orderItems?.map(item => ({ productId: item.product.id, quantity: item.quantity }));
        const newOrder = {
            ...cleanOrder,
            orderItems: formattedOrderItems,
            orderStatus: order.orderStatus
        }
        // console.log(newOrder);
        const response = await axios.put<Order>(`${ORDERS_URL}/${id}`, newOrder);
        return response.data;
    } catch (error) {
        throw new Error(`Error updating order with ID ${order.id}: ${axios.isAxiosError(error) ? error.response?.data?.message || error.message : error}`);
    }
};

export const deleteOrder = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${ORDERS_URL}/${id}`);
    } catch (error) {
        throw new Error(`Error deleting order with ID ${id}: ${error}`);
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
