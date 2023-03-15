import { PrismaClient } from "@prisma/client";
import logger from "./logger";


export const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'event',
      level: 'error',
    },
    {
      emit: 'event',
      level: 'info',
    },
    {
      emit: 'event',
      level: 'warn',
    },
  ],
});

prisma.$on('query', (e) => {
  logger.info({
    library: "Prisma",
    message: {
      query: e.query,
      params: e.params,
      duration: e.duration + "ms",
    }
  });
})

prisma.$on('info', (e) => {
  logger.info({ library: "Prisma", message: e.message });
})

prisma.$on('error', (e) => {
  logger.error({ library: "Prisma", message: e.message });
})

prisma.$on('warn', (e) => {
  logger.warn({ library: "Prisma", message: e.message });
})