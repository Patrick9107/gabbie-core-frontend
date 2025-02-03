import {BaseEntity} from "./BaseEntity.ts";

export interface Container extends BaseEntity {
    type: string;
    depositAmount: number;
}