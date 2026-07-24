import type { OAuth2Tokens } from "arctic";
import { OAuth2RequestError } from "arctic";
import { error } from "@sveltejs/kit";
import { discord } from "./oauth";
import redis from "../redis";

const ACCESS_TOKEN_PREFIX = "discord:accesstoken:";
const REFRESH_TOKEN_PREFIX = "discord:refreshtoken:";

function accessTokenKey(userId: string) {
  return `${ACCESS_TOKEN_PREFIX}${userId}`;
}

function refreshTokenKey(userId: string) {
  return `${REFRESH_TOKEN_PREFIX}${userId}`;
}

export async function storeDiscordTokens(
  userId: string,
  tokens: OAuth2Tokens,
  existingRefreshToken?: string,
) {
  const transaction = redis
    .multi()
    .set(accessTokenKey(userId), tokens.accessToken(), "EX", tokens.accessTokenExpiresInSeconds());

  if (tokens.hasRefreshToken()) {
    transaction.set(refreshTokenKey(userId), tokens.refreshToken());
  } else if (existingRefreshToken) {
    transaction.set(refreshTokenKey(userId), existingRefreshToken);
  }

  await transaction.exec();
}

export async function deleteDiscordAccessToken(userId: string) {
  await redis.del(accessTokenKey(userId));
}

export function discordReconnectRequired(url: URL | string): never {
  const destination = typeof url === "string" ? new URL(url) : url;

  error(401, {
    message: "your Discord connection has expired. reconnect it to manage your servers.",
    reconnectUrl: `/login?reauthorize=true&next=${encodeURIComponent(
      destination.pathname + destination.search,
    )}`,
  });
}

export async function getDiscordAccessToken(userId: string): Promise<string | null> {
  const accessToken = await redis.get(accessTokenKey(userId));
  if (accessToken) return accessToken;

  return refreshDiscordAccessToken(userId);
}

async function refreshDiscordAccessToken(userId: string): Promise<string | null> {
  const refreshToken = await redis.get(refreshTokenKey(userId));
  if (!refreshToken) return null;

  try {
    const tokens = await discord.refreshAccessToken(refreshToken);
    await storeDiscordTokens(userId, tokens, refreshToken);
    return tokens.accessToken();
  } catch (error) {
    if (error instanceof OAuth2RequestError) {
      await redis.del(refreshTokenKey(userId));
      return null;
    }

    throw error;
  }
}
