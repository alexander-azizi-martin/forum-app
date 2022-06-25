import fastify, { FastifyServerOptions } from 'fastify';
import prisma from 'config/prisma';

const createApp = (options: FastifyServerOptions) => {
  const app = fastify(options);

  app.addHook('onReady', async () => {
    await prisma.$connect();
  });

  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });

  return app;
};

export default createApp;
