import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const rateLimiter = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, "15 s")
});

export default rateLimiter;
