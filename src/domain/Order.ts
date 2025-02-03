import {OrderItem} from "./OrderItem.ts";
import {BaseEntity} from "./BaseEntity.ts";
import {OrderStatus} from "./enums/OrderStatus.ts";
import {OrderSource} from "./enums/OrderSource.ts";

export interface Order extends BaseEntity {
    deliveryDate: Date;
    address: string;
    phoneNumber: string;
    items: OrderItem[];
    status: OrderStatus; //enum
    note: string;
    orderSource: OrderSource; //enum
    deliveryTimeWindowStart: Date;
    deliveryTimeWindowEnd: Date;
    totalAmount: number;
}