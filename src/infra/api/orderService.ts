import axios from "axios";
import { Order } from "../../domain/Order.ts";
import { API_BASE_URL } from "../../../apiConfig.ts";
import {OrderResponse} from "../../domain/OrderResponse.ts";

const ORDERS_URL = `${API_BASE_URL}/Order`;

export const fetchOrders = async (): Promise<OrderResponse[]> => {
    try {
        const response = await axios.get<OrderResponse[]>(ORDERS_URL);
        return response.data.map((order) => formatDates(order));
    } catch (error) {
        handleError(error);
        return [];
    }
};

export const fetchOrderById = async (id: number): Promise<Order | null> => {
    try {
        const response = await axios.get<OrderResponse>(`${ORDERS_URL}/${id}`);
        return formatDates(response.data);
    } catch (error) {
        throw new Error(`Error fetching order with ID ${id}: ${error}`);
    }
};

export const createOrder = async (order: OrderResponse): Promise<OrderResponse> => {
    try {
        const {totalAmount: _totalAmount, createdAt: _createdAt, updatedAt: _updatedAt, id: _id, ...cleanOrder } = order;
        const formattedOrderItems = cleanOrder.orderItems.map(item => ({ productId: item.product.id, quantity: item.quantity }));
        const newOrder = {
            ...cleanOrder,
            deliveryDate: cleanOrder.deliveryDate ? cleanOrder.deliveryDate.toISOString() : null,
            orderItems: formattedOrderItems,
            orderStatus: order.orderStatus
        }
        const response = await axios.post<OrderResponse>(ORDERS_URL, newOrder);
        return formatDates(response.data);
    } catch (error) {
        throw new Error(`Error creating order: ${axios.isAxiosError(error) ? error.response?.data?.message || error.message : error}`);
    }
};

export const updateOrder = async (order: OrderResponse): Promise<OrderResponse> => {
    try {
        const {totalAmount: _totalAmount, createdAt: _createdAt, updatedAt: _updatedAt, id, ...cleanOrder } = order;
        const formattedOrderItems = cleanOrder.orderItems
            ?.reduce<{ productId: number; quantity: number }[]>((acc, item) => {
                const existingItem = acc.find(i => i.productId === item.product.id);
                if (existingItem) {
                    existingItem.quantity += item.quantity;
                } else {
                    acc.push({ productId: item.product.id, quantity: item.quantity });
                }
                return acc;
            }, []);
        const newOrder = {
            ...cleanOrder,
            deliveryDate: cleanOrder.deliveryDate ? cleanOrder.deliveryDate.toISOString() : null,
            orderItems: formattedOrderItems,
            orderStatus: order.orderStatus
        }
        const response = await axios.put<OrderResponse>(`${ORDERS_URL}/${id}`, newOrder);
        return formatDates(response.data);
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

const formatDates = (order: OrderResponse) => {
    return {
        ...order,
        deliveryDate: order.deliveryDate ? new Date(order.deliveryDate) : null,
        deliveryWindowStartDate: order.deliveryWindowStartDate ? new Date(order.deliveryWindowStartDate) : null,
        deliveryWindowEndDate: order.deliveryWindowEndDate ? new Date(order.deliveryWindowEndDate) : null,
    };
}
