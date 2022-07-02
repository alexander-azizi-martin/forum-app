import fastify, { FastifyServerOptions } from 'fastify';
import { configPrisma } from 'config/prisma';
import { SessionRouter } from 'components/sessions';
import { UserRouter } from 'components/users';

const createApp = (options: FastifyServerOptions) => {
  const app = fastify(options);

  app.register(configPrisma).register(SessionRouter).register(UserRouter);

  return app;
};

export default createApp;
