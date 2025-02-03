import {BaseEntity} from "./BaseEntity.ts";
import {RouteStatus} from "./enums/RouteStatus.ts";

export interface Route extends BaseEntity {
    totalDuration: number;
    totalDistance: number;
    optimized: boolean;
    startTime: Date;
    endTime: Date;
    status: RouteStatus;
}