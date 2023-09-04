import { Ratelimit } from "@upstash/ratelimit";
import redis from "./redis";

const rateLimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(12, "5 s"),
});

export default rateLimiter;
