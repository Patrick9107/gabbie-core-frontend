import {BaseEntity} from "./BaseEntity.ts";
import {Product} from "./Product.ts";

export interface OrderItem extends BaseEntity {
    product: Product;
    quantity: number;
}