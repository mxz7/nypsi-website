import { Ratelimit } from "@upstash/ratelimit";
import redis from "./redis";

const rateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(50, "1 m"),
});

export default rateLimiter;
