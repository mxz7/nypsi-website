export interface BotStatus {
  main: boolean;
  clusters: {
    id: number;
    online: boolean;
    responsive: boolean;
    guilds: { id: string; shard: number }[];
    shards: {
      id: number;
      status: "idle" | "connecting" | "resuming" | "ready";
      ping: number;
      lastPing: number;
    }[];
  }[];
  cached: number;
}
