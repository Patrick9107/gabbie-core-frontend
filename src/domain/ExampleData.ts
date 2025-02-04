import { Container } from "./Container.ts";
import { Product } from "./Product.ts";
import { OrderItem } from "./OrderItem.ts";
import { Route } from "./Route.ts";
import { Order } from "./Order.ts";
import { Delivery } from "./Delivery.ts";
import { Vehicle } from "./Vehicle.ts";
import { OrderSource } from "./enums/OrderSource.ts";
import { OrderStatus } from "./enums/OrderStatus.ts";
import { DeliveryStatus } from "./enums/DeliveryStatus.ts";
import { RouteStatus } from "./enums/RouteStatus.ts";
import { VehicleStatus } from "./enums/VehicleStatus.ts";

export const container1: Container = {
    id: 1,
    type: "Plastik",
    depositAmount: 0.5
};

export const container2: Container = {
    id: 2,
    type: "Glas",
    depositAmount: 1.0
};

export const container3: Container = {
    id: 3,
    type: "Metall",
    depositAmount: 1.5
};

export const container4: Container = {
    id: 4,
    type: "Papier",
    depositAmount: 0.2
};

export const product1: Product = {
    id: 1,
    price: 10.99,
    weight: 1.2,
    name: "Wasserflasche",
    description: "500ml Mineralwasser",
    imageUrl: "https://example.com/wasser.jpg",
    container: container1
};

export const product2: Product = {
    id: 2,
    price: 5.99,
    weight: 0.8,
    name: "Limonade",
    description: "330ml Zitronenlimonade",
    imageUrl: "https://example.com/limonade.jpg",
    container: container2
};

export const product3: Product = {
    id: 3,
    price: 2.49,
    weight: 0.5,
    name: "Dosenbier",
    description: "500ml Bier in der Dose",
    imageUrl: "https://example.com/bier.jpg",
    container: container3
};

export const product4: Product = {
    id: 4,
    price: 3.99,
    weight: 1.0,
    name: "Apfelsaft",
    description: "1L naturtrüber Apfelsaft",
    imageUrl: "https://example.com/apfelsaft.jpg",
    container: container4
};

export const orderItem1: OrderItem = {
    id: 1,
    product: product1,
    quantity: 2
};

export const orderItem2: OrderItem = {
    id: 2,
    product: product2,
    quantity: 1
};

export const orderItem3: OrderItem = {
    id: 3,
    product: product3,
    quantity: 6
};

export const orderItem4: OrderItem = {
    id: 4,
    product: product4,
    quantity: 3
};

export const order1: Order = {
    id: 1,
    deliveryDate: new Date("2025-02-10"),
    address: "Musterstraße 1, 1010 Wien",
    phoneNumber: "+43123456789",
    items: [orderItem1, orderItem2],
    status: OrderStatus.Ausstehend,
    note: "Klingeln, wenn niemand öffnet, anrufen",
    orderSource: OrderSource.WhatsApp,
    deliveryTimeWindowStart: new Date("2025-02-10T09:00:00"),
    deliveryTimeWindowEnd: new Date("2025-02-10T12:00:00"),
    totalAmount: 16.98
};

export const order2: Order = {
    id: 2,
    deliveryDate: new Date("2025-02-11"),
    address: "Hauptstraße 5, 4020 Linz",
    phoneNumber: "+437654321",
    items: [orderItem3],
    status: OrderStatus.Geliefert,
    note: "Vor der Garage abstellen",
    orderSource: OrderSource.SMS,
    deliveryTimeWindowStart: new Date("2025-02-11T13:00:00"),
    deliveryTimeWindowEnd: new Date("2025-02-11T15:00:00"),
    totalAmount: 14.94
};

export const order3: Order = {
    id: 3,
    deliveryDate: new Date("2025-02-12"),
    address: "Marktplatz 10, 8010 Graz",
    phoneNumber: "+43316543210",
    items: [orderItem4],
    status: OrderStatus.Storniert,
    note: "Bestellung wurde storniert",
    orderSource: OrderSource.Anruf,
    deliveryTimeWindowStart: new Date("2025-02-12T08:00:00"),
    deliveryTimeWindowEnd: new Date("2025-02-12T10:00:00"),
    totalAmount: 11.97
};

export const order4: Order = {
    id: 4,
    deliveryDate: new Date("2025-02-13"),
    address: "Dorfstraße 20, 5020 Salzburg",
    phoneNumber: "+43662876543",
    items: [orderItem1, orderItem3],
    status: OrderStatus.Verschoben,
    note: "Neuer Liefertermin am 15.02.",
    orderSource: OrderSource.Andere,
    deliveryTimeWindowStart: new Date("2025-02-13T14:00:00"),
    deliveryTimeWindowEnd: new Date("2025-02-13T16:00:00"),
    totalAmount: 31.92
};

export const vehicle1: Vehicle = {
    id: 1,
    licensePlate: "W-12345X",
    capacity: 500,
    status: VehicleStatus.Verfuegbar
};

export const vehicle2: Vehicle = {
    id: 2,
    licensePlate: "L-67890Y",
    capacity: 700,
    status: VehicleStatus.In_Benutzung
};

export const vehicle3: Vehicle = {
    id: 3,
    licensePlate: "G-54321Z",
    capacity: 600,
    status: VehicleStatus.In_Wartung
};

export const vehicle4: Vehicle = {
    id: 4,
    licensePlate: "S-98765A",
    capacity: 800,
    status: VehicleStatus.Nicht_verfuegbar
};

export const route1: Route = {
    id: 1,
    totalDuration: 120,
    totalDistance: 50,
    optimized: true,
    startTime: new Date("2025-02-10T07:00:00"),
    endTime: new Date("2025-02-10T09:00:00"),
    status: RouteStatus.Wird_Optimiert
};

export const route2: Route = {
    id: 2,
    totalDuration: 180,
    totalDistance: 80,
    optimized: false,
    startTime: new Date("2025-02-11T10:00:00"),
    endTime: new Date("2025-02-11T13:00:00"),
    status: RouteStatus.Abgeschlossen
};

export const route3: Route = {
    id: 3,
    totalDuration: 150,
    totalDistance: 60,
    optimized: true,
    startTime: new Date("2025-02-12T08:30:00"),
    endTime: new Date("2025-02-12T11:00:00"),
    status: RouteStatus.Fehlgeschlagen
};

export const route4: Route = {
    id: 4,
    totalDuration: 200,
    totalDistance: 90,
    optimized: false,
    startTime: new Date("2025-02-13T12:00:00"),
    endTime: new Date("2025-02-13T15:20:00"),
    status: RouteStatus.Abgeschlossen
};

export const delivery1: Delivery = {
    id: 1,
    status: DeliveryStatus.Geplant,
    route: route1,
    vehicle: vehicle1,
    orders: [order1, order2],
    reserveStock: [orderItem1, orderItem3]
};

export const delivery2: Delivery = {
    id: 2,
    status: DeliveryStatus.Unterwewgs,
    route: route2,
    vehicle: vehicle2,
    orders: [order3],
    reserveStock: [orderItem2]
};

export const delivery3: Delivery = {
    id: 3,
    status: DeliveryStatus.Abgeschlossen,
    route: route3,
    vehicle: vehicle3,
    orders: [order4],
    reserveStock: [orderItem4]
};

export const delivery4: Delivery = {
    id: 4,
    status: DeliveryStatus.Geplant,
    route: route4,
    vehicle: vehicle4,
    orders: [order1, order3],
    reserveStock: [orderItem1, orderItem2]
};
