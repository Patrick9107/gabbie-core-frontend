import {BaseEntity} from "./BaseEntity.ts";
import {Order} from "./Order.ts";
import {OrderItem} from "./OrderItem.ts";
import {Vehicle} from "./Vehicle.ts";
import {Route} from "./Route.ts";
import {DeliveryStatus} from "./enums/DeliveryStatus.ts";

export interface Delivery extends BaseEntity {
    status: DeliveryStatus;
    route: Route;
    vehicle: Vehicle;
    orders: Order[];
    reserveStock: OrderItem[];
}