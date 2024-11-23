import { env } from "$env/dynamic/private";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_PASS,
});

export default redis;
