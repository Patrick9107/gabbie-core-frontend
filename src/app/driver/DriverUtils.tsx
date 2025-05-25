// DriverUtils.ts

export interface OrderItem {
    id: number;
    product: {
        id: number;
        price: number;
        weight: number;
        name: string;
        description: string;
        imageUrl: string;
        container: string | null;
    };
    quantity: number;
}

export interface Order {
    id: number;
    createdAt: string;
    updatedAt: string;
    deliveryDate: string;
    address: string;
    phoneNumber: string;
    orderItems: OrderItem[];
    status: number;
    note: string;
    orderSource: number;
    deliveryWindowStartDate: string | null;
    deliveryWindowEndDate: string | null;
    totalAmount: number;
    routeId: number;
}

export interface RawStop {
    name: string;
    arrival: number;
    distance: number;
    status: string;
    products: string; // This might contain product names, consider parsing if detailed product info is needed
    customerData: string;
    note: string;
    order: Order;
}

export interface RouteData {
    origin: string;
    destination: string;
    waypoints: Array<{
        location: string;
        stopover: boolean;
    }>;
    rawStops: RawStop[];
    orderIds: number[] | null; // Changed to number[] | null as per your example JSON
    reserveStock: OrderItem[]; // <--- ADD THIS LINE
}

export const deserializeRouteData = (jsonString: string): RouteData => {
    return JSON.parse(jsonString);
};