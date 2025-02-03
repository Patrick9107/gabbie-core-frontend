import {BaseEntity} from "./BaseEntity.ts";
import {VehicleStatus} from "./enums/VehicleStatus.ts";

export interface Vehicle extends BaseEntity {
    licensePlate: string;
    capacity: number;
    status: VehicleStatus;
}