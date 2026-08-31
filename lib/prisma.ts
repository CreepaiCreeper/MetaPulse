import { PrismaClient } from "@prisma/client";

const globalprismathis = globalThis as unknown as {prisma: PrismaClient}

export const prisma =  globalprismathis.prisma || new PrismaClient();

if(process.env.NODE_ENV !== "production") globalprismathis.prisma = prisma

export default prisma