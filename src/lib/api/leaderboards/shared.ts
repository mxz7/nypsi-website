import { z } from "zod";

export const LeaderboardTypeSchema = z.enum([
  "balance",
  "net-worth",
  "level",
  "guilds",
  "streak",
  "lottery",
  "commands",
  "vote-month",
  "vote-streak",
  "wordle-wins",
  "wordle-time",
  "chess-solved",
  "chess-rating",
  "chess-fastest",
  "chatreaction-daily",
  "chatreaction-alltime",
  "flag-wins",
  "flag-time",
]);

export type LeaderboardType = z.infer<typeof LeaderboardTypeSchema>;

export function formatTime(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  let seconds = ((ms % 60000) / 1000).toFixed(2);
  if (minutes > 0) {
    seconds = Math.round((ms % 60000) / 1000).toString();
  }
  return `${minutes > 0 ? `${minutes}m` : ""}${seconds}s`;
}
