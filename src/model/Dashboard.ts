import type {DashboardWidget} from "./DashboardWidget.ts";


export type DashboardStatus = "Active" | "Draft" | "Disabled";

export interface Dashboard {
    id: number;
    name: string;
    description: string;
    role_id: string;
    status: DashboardStatus;
    updatedAt: string;
    widgets:DashboardWidget[];
}