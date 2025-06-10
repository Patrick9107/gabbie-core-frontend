// DriverUtils.tsx

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
    // 'status' wird vom Backend als 'pending', 'completed' etc. kommen.
    // Das Frontend-Modell erwartet aber `orderStatus`. Wir fügen es hier hinzu.
    // Annahme ist, dass es sich um eine Zahl (Enum-Wert) handelt.
    status: number | string; // Behalten wir zur Kompatibilität mit dem bestehenden Code.
    orderStatus: number; // --- DIESE ZEILE WURDE HINZUGEFÜGT ---
    note: string;
    orderSource: number;
    deliveryWindowStartDate: string | null;
    deliveryWindowEndDate: string | null;
    totalAmount: number;
    routeId: number;
}

// RawStop und RouteData bleiben unverändert, aber profitieren von der korrigierten Order-Definition.
export interface RawStop {
    name: string;
    arrival: number;
    distance: number;
    status: string;
    products: string;
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
    orderIds: number[] | null;
    reserveStock: OrderItem[];
}

export const deserializeRouteData = (jsonString: string): RouteData => {
    return JSON.parse(jsonString);
};