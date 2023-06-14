export type LeaderboardData = {
  user: {
    id?: string;
    username: string;
  };
  value: string;
  position: number;
}[];
