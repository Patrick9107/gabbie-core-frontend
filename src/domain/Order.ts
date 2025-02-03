import {OrderItem} from "./OrderItem.ts";
import {BaseEntity} from "./BaseEntity.ts";
import {TimeWindow} from "./TimeWindow.ts";

export interface Order extends BaseEntity {
    deliveryDate: Date;
    deliveryLocation: {
        address: string;
    }
    phoneNumber: {
        phoneNumber: string;
    }
    items: OrderItem[];
    status: number; //enum
    note: string;
    orderSource: number; //enum
    deliveryTimeWindow: TimeWindow;
    totalAmount: number;
}