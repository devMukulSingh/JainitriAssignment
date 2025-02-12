import { PrismaClient } from "@prisma/client"


export const BASE_URL_CLIENT = 'http://localhost:5173'


export const prisma = new PrismaClient();