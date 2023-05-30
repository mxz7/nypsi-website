import { REDIS_PASS, REDIS_URL } from "$env/static/private";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: REDIS_URL,
  token: REDIS_PASS
});

export default redis;
