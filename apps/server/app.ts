import fastify, { FastifyServerOptions } from 'fastify';
import autoload from '@fastify/autoload';
import { URL } from 'url';

const createApp = (options: FastifyServerOptions) => {
  const app = fastify(options);

  const components = new URL('components', import.meta.url);

  app.register(autoload, {
    dir: components.pathname,
    dirNameRoutePrefix: false,
    scriptPattern: /.*\.routes\.(ts|js)$/,
  });

  return app;
};

export default createApp;
