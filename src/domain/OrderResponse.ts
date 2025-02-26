import { Order } from "./Order.ts";

export interface OrderResponse extends Order {
    totalAmount: number;
    createdAt: Date | null;
    updatedAt: Date | null;
}