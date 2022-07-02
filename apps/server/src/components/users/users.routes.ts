import type { FastifyPluginCallback as Router } from 'fastify';
import { validateBody, authenticate } from 'middleware';
import { UserControllers, UserSchemas, UserMiddleware } from 'components/users';

const sessionRouter: Router = (app, opts, done) => {
  app.get('/:username', {
    preHandler: [UserMiddleware.validateUsername()],
    handler: UserControllers.show,
  });

  app.get('/me', {
    preHandler: [authenticate()],
    handler: UserControllers.showMe,
  });

  app.delete('/:username', {
    preHandler: [UserMiddleware.validateUsername(), authenticate()],
    handler: UserControllers.destroy,
  });

  app.post('/', {
    preHandler: [validateBody(UserSchemas.credentials)],
    handler: UserControllers.create,
  });

  done();
};

export default sessionRouter;
