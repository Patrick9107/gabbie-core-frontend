import {Order} from "./Order.ts";

export interface Stop {
    name: string;
    arrival: number;
    distance: number;
    status: string;
    products: string;
    customerData: string;
    note: string;
    order: Order;
}