export type LeaderboardData = {
  user: {
    id?: string;
    username: string;
    tag?: string;
  };
  value: string;
  position: number;
}[];
