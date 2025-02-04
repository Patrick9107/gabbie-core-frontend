// import {Order} from "../../domain/Order.ts";
// import {OrderItem} from "../../domain/OrderItem.ts";
// import {OrderStatus} from "../../domain/enums/OrderStatus.ts";
// import {OrderSource} from "../../domain/enums/OrderSource.ts";
//
// const url: string = "https://localhost:7160/api/Order";
//
// const fetchOrders = async (): Promise<Order[]> => {
//     const response = await fetch(url);
//     const data: Order[] = await response.json(); // JSON is already parsed
//     console.log(data); // Log raw data for debugging
//
//     return data.map((order: Order) => ({
//         id: order.id,
//         deliveryDate: new Date(order.deliveryDate),
//         address: order.address,
//         phoneNumber: order.phoneNumber,
//         items: order.items.map((item: OrderItem) => ({
//             id: item.id,
//             product: {
//                 id: item.product.id,
//                 price: item.product.price,
//                 weight: item.product.weight,
//                 name: item.product.name,
//                 description: item.product.description,
//                 imageUrl: item.product.imageUrl,
//                 container: {
//                     id: item.product.container.id,
//                     type: item.product.container.type,
//                     depositAmount: item.product.container.depositAmount
//                 }
//             },
//             quantity: item.quantity
//         })) as OrderItem[],
//         status: order.status as OrderStatus,
//         note: order.note,
//         orderSource: order.orderSource as OrderSource,
//         deliveryTimeWindowStart: new Date(order.deliveryTimeWindowStart),
//         deliveryTimeWindowEnd: new Date(order.deliveryTimeWindowEnd),
//         totalAmount: order.totalAmount
//     }));
// };
//
// let orders: Order[];
//
// // Usage: Call the function and use the result
// fetchOrders().then((order) => {
//     orders = order;
// });