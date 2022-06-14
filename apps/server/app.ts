import fastify, { FastifyServerOptions } from 'fastify';
import autoload from '@fastify/autoload';
import { URL } from 'url';

import prisma from '~/config/prisma';

const createApp = (options: FastifyServerOptions) => {
  const app = fastify(options);

  const components = new URL('components', import.meta.url);

  app.register(autoload, {
    dir: components.pathname,
    dirNameRoutePrefix: false,
    scriptPattern: /.*\.routes\.(ts|js)$/,
  });

  app.addHook('onReady', async () => {
    await prisma.$connect();
  });

  app.addHook('onClose', async () => {
    await prisma.$disconnect();
  });

  return app;
};

export default createApp;
