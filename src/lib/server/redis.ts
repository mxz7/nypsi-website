import { REDIS_URL } from "$app/env/private";
import Redis from "ioredis";

const redis = new Redis(REDIS_URL, { lazyConnect: true });

export default redis;
