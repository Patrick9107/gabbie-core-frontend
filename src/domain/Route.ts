import {BaseEntity} from "./BaseEntity.ts";
import {RouteStatus} from "./enums/RouteStatus.ts";

export interface Route extends BaseEntity {
    totalDuration: number;
    totalDistance: number;
    startTime: string;
    endTime: string;
    status: RouteStatus;
    orderIds: number[];
}