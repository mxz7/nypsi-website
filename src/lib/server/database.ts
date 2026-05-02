import { env } from "$env/dynamic/private";
import { PrismaClient } from "@generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL, max: 10 });
const prisma = new PrismaClient({ adapter });

export default prisma;
