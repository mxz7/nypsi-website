import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

const rateLimiter = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, "10 s")
});

export default rateLimiter;
