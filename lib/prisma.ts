import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
// Optionally, you can log the loaded environment variables for debugging
// console.log(`The connection URL is ${connectionString}`);

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const adapter = new PrismaPg({ connectionString });

// Global usage meant to ensure only one instance of the client exists
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
