export interface Widget {
    id: number;
    name: string;
    widget_code: string;
    min_width: number;
    max_width: number;
    min_height: number;
    max_height: number;
    category?: string;
    component?: any;
}