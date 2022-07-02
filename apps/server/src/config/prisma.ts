import type { FastifyPluginCallback as Plugin } from 'fastify';
import Prisma from '@prisma/client';

const prisma = new Prisma.PrismaClient({
  datasources: {
    db: {
      url:
        process.env.NODE_ENV === 'test'
          ? process.env.TEST_DATABASE_URL
          : process.env.DATABASE_URL,
    },
  },
});

export default prisma;

export const configPrisma: Plugin = (app, opts, done) => {
  app.addHook('onReady', async () => {
    await prisma.$connect();
  });

  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });

  done();
};

export enum PrismaErrorCodes {
  CONFLICT = 'P2002',
  NOT_FOUND = 'P2025',
}
