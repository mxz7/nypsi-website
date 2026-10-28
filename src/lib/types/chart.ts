export type ChartPoint = { x: number; y: number | null };

export interface ChartSeries {
  label: string;
  data: (number | null | ChartPoint)[];
  kind?: "line" | "scatter";
  axis?: "right";
  color?: string;
  fill?: boolean;
  fillColor?: string;
  width?: number;
  pointRadius?: number;
}

/** Serializable chart data shared by server data functions and the LayerChart renderer. */
export interface ChartData {
  kind: "line" | "scatter";
  labels: (string | number)[];
  series: ChartSeries[];
}

export interface ChartOptions {
  legend?: boolean;
  sparkline?: boolean;
  points?: number;
  xFormat?: (value: string | number) => string;
  valueFormat?: (value: number) => string;
  tooltipFormat?: (value: number, label: string) => string;
  sortTooltip?: boolean;
}
