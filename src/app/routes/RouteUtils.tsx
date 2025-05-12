import { Order } from "../../domain/Order.ts";
import { Stop } from "../../domain/Stop.ts";
import { OrderStatus } from "../../domain/enums/OrderStatus.ts";
import { OrderSource } from "../../domain/enums/OrderSource.ts";
import { API_BASE_URL } from "../../../apiConfig.ts";

const fetchRouteData = async (requestBody: any) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 10000));
        
        const response = await fetch(`${API_BASE_URL}/Tour/createRouteWithAddress`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch route with status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error during route data fetch:", error);
        throw error;
    }
};

export const handleGetRoute = async (orders: Order[], fixedStartAddress: string) => {
    try {
        const requestBody = {
            locations: [
                { address: fixedStartAddress},
                ...orders.map((order) => ({ address: order.address})), 
            ],
            parameters: [
                {type: 'car'},
            ],
        };

        console.log("Request Body:", JSON.stringify(requestBody, null, 2));

        const routeData = await fetchRouteData(requestBody);

        console.log("RouteXL Response:", JSON.stringify(routeData, null, 2));

        let orderedAddresses = Object.values(routeData.route).map((stop: any) => stop.name);

        if (orderedAddresses[0] !== fixedStartAddress) {
            orderedAddresses.unshift(fixedStartAddress);
        }

        const rawStops: Stop[] = orderedAddresses.map((address, index) => {
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

            const stopData = routeData.route[index];
            return {
                name: address,
                arrival: index === 0 ? 0 : stopData.arrival,
                distance: index === 0 ? 0 : stopData.distance,
                status: "pending",
                products: matchingOrder.orderItems.map((item) => item.product.name).join(", ") || "Keine Produkte",
                customerData: matchingOrder.phoneNumber,
                note: matchingOrder.note,
                order: matchingOrder,
            };
        });

        return {
            origin: orderedAddresses[0],
            destination: orderedAddresses[orderedAddresses.length - 1],
            waypoints: orderedAddresses.slice(1, -1).map((address) => ({ location: address, stopover: true })),
            rawStops,
            orderIds: rawStops.map((stop) => stop.order.id),
        };
    } catch (error) {
        console.error("Error fetching route:", error);
        throw error;
    }
};