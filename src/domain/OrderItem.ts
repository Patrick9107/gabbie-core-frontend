import {Product} from "./Product.ts";

export interface OrderItem {
    product: Product;
    quantity: number;
}