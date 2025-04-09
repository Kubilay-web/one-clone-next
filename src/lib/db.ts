import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

// Export directly for use
export default prisma;

// If you want to use getPrismaClient, you can also export that:
export const getPrismaClient = () => prisma;
