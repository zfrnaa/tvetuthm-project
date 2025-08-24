import { LucideIcon } from "lucide-react";

export interface ClusterMetric {
    name: string;
    value: number;
}

export interface ClusterData {
    id: string;
    name: string;
    icon: LucideIcon;
    color: string;
    description: string;
    score: number;
    metrics: ClusterMetric[];
}