export interface LeaderboardsData {
  [key: string]: { name: string; path: string; children?: LeaderboardsData };
}

export const leaderboards: LeaderboardsData = {
  balance: { name: "balance", path: "/leaderboards/balance" },
  "net-worth": { name: "net-worth", path: "/leaderboards/net-worth" },
  level: { name: "level", path: "/leaderboards/level" },
  guilds: { name: "guilds", path: "/leaderboards/guilds" },
  "daily-streak": { name: "daily-streak", path: "/leaderboards/streak" },
  lottery: { name: "lottery", path: "/leaderboards/lottery" },
  commands: { name: "commands", path: "/leaderboards/commands" },
  chess: {
    name: "chess",
    path: "/leaderboards/chess",
    children: {
      solved: { name: "puzzles solved", path: "/leaderboards/chess/solved" },
      rating: { name: "average rating", path: "/leaderboards/chess/rating" },
      fastest: { name: "fastest solve", path: "/leaderboards/chess/fastest" },
    },
  },
  vote: {
    name: "vote",
    path: "/leaderboards/vote",
    children: {
      month: { name: "votes this month", path: "/leaderboards/vote/month" },
      streak: { name: "vote streak", path: "/leaderboards/vote/streak" },
    },
  },
  wordle: {
    name: "wordle",
    path: "/leaderboards/wordle",
    children: {
      wins: { name: "wins", path: "/leaderboards/wordle/wins" },
      time: { name: "fastest wins", path: "/leaderboards/wordle/time" },
    },
  },
  chatreaction: {
    name: "chat reactions",
    path: "/leaderboards/chatreaction",
    children: {
      daily: { name: "daily fastest", path: "/leaderboards/chatreaction/daily" },
      alltime: { name: "all time fastest", path: "/leaderboards/chatreaction/alltime" },
    },
  },
};
