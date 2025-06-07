export type LeaderboardData = {
  user?: {
    id?: string;
    username: string;
    tag?: string;
  };
  guild?: {
    id: string;
  };
  value: string;
  position: number;
}[];
