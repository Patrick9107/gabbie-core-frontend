import {OrderItem} from "./OrderItem.ts";
import {BaseEntity} from "./BaseEntity.ts";
import {OrderStatus} from "./enums/OrderStatus.ts";
import {OrderSource} from "./enums/OrderSource.ts";

export interface Order extends BaseEntity {
    deliveryDate: Date | null;
    address: string;
    phoneNumber: string;
    orderItems: OrderItem[];
    orderStatus: OrderStatus; //enum
    note: string;
    orderSource: OrderSource; //enum
    deliveryWindowStartDate: Date | null;
    deliveryWindowEndDate: Date | null;
    totalAmount: number;
}

export type defaultOrder = Omit<Order, "id" | "totalAmount">;