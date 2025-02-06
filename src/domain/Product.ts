import {BaseEntity} from "./BaseEntity.ts";
import {Container} from "./Container.ts";

export interface Product extends BaseEntity {
    price: number;
    weight: number;
    name: string;
    description: string;
    imageUrl: string | null;
    container: Container | null | undefined;
}