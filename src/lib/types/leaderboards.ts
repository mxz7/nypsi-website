export type LeaderboardData = {
  user?: {
    id?: string;
    username: string;
    avatar?: string;
  };
  guild?: {
    id: string;
  };
  value: string;
  position: number;
}[];

export type LeaderboardPosition = {
  position: number;
  value: string;
};

export function getLeaderboardUpdatesChannel(leaderboard: string) {
  return `nypsi:leaderboard:${leaderboard}`;
}

export type LeaderboardUpdateEvent = {
  entityId: string;
  value: string;
  increment?: true;
};
