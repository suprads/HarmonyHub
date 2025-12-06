import "../envConfig"; // Ensure environment variables are loaded
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;
// Optionally, you can log the loaded environment variables for debugging
//console.log(`The connection URL is ${process.env.DATABASE_URL}`);

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
