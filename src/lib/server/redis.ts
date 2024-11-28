import { env } from "$env/dynamic/private";
import Redis from "ioredis";

const redis = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
});

export default redis;
