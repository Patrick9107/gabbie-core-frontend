import { Order } from "../../domain/Order.ts";
import { Stop } from "../../domain/Stop.ts";
import { OrderStatus } from "../../domain/enums/OrderStatus.ts";
import { OrderSource } from "../../domain/enums/OrderSource.ts";
import { API_BASE_URL } from "../../../apiConfig.ts";

const fetchRouteData = async (requestBody: any) => {
    try {
        const response = await fetch(`${API_BASE_URL}/Tour/createRouteWithAddress`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        console.log(response)
        
        if (!response.ok) {
            throw new Error(`Failed to fetch route with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error during route data fetch:", error);
        throw error;
    }
};

const createStop = (address: string, index: number, orders: Order[], routeData: any): Stop => {
    const matchingOrder = orders.find((order) => order.address === address) || {
        id: 0,
        address,
        phoneNumber: "",
        orderItems: [],
        orderStatus: OrderStatus.Ausstehend,
        note: "",
        orderSource: OrderSource.SMS,
        deliveryDate: null,
        deliveryWindowStartDate: null,
        deliveryWindowEndDate: null,
    };

    return {
        name: address,
        arrival: routeData.route[index + 1]?.arrival || 0,
        distance: routeData.route[index + 1]?.distance || 0,
        status: "pending",
        products: matchingOrder.orderItems.map((item) => item.product.name).join(", ") || "Keine Produkte",
        customerData: matchingOrder.phoneNumber,
        note: matchingOrder.note,
        order: matchingOrder,
    };
};

export const handleGetRoute = async (orders: Order[]) => {
    try {
        const requestBody = {
            locations: orders.map((order) => ({ address: order.address, serviceTime: 8 })),
        };

        console.log("Request Body to RouteXL API:", JSON.stringify(requestBody, null, 2));
        
        const routeData = await fetchRouteData(requestBody);

        console.log("RouteXL Response:", routeData);

        const orderedAddresses = Object.values(routeData.route).map((stop: any) => stop.name);
        
        const rawStops: Stop[] = orderedAddresses.slice(1).map((address, index) => createStop(address, index, orders, routeData));

        const origin = orderedAddresses[0];
        const destination = orderedAddresses[orderedAddresses.length - 1];
        const waypoints = orderedAddresses.slice(1, -1).map((address) => ({ location: address, stopover: true }));

        return {
            origin,
            destination,
            waypoints,
            rawStops,
            orderIds: rawStops.map((stop) => stop.order.id),
        };
    } catch (error) {
        console.error("Error fetching route:", error);
        throw error;
    }
};
