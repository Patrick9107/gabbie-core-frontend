import {Stop} from "./Stop.ts";

export interface RouteState {
    origin: string;
    destination: string;
    waypoints: { location: string; stopover: boolean }[];
    rawStops: Stop[];
}