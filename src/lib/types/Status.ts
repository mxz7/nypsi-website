export interface BotStatus {
  main: boolean;
  clusters: { id: number; online: boolean; responsive: boolean }[];
  cached: number;
}
