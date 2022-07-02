import type { FastifyPluginCallback as Router } from 'fastify';
import { validateBody } from 'middleware';
import { UserSchemas } from 'components/users';
import { SessionControllers, SessionSchemas } from 'components/sessions';

const sessionRouter: Router = (app, opts, done) => {
  app.post('/', {
    preHandler: [validateBody(UserSchemas.credentials)],
    handler: SessionControllers.create,
  });

  app.post('/refresh', {
    preHandler: [validateBody(SessionSchemas.refreshToken)],
    handler: SessionControllers.refresh,
  });

  app.delete('/', {
    preHandler: [validateBody(SessionSchemas.refreshToken)],
    handler: SessionControllers.destroy,
  });

  done();
};

export default sessionRouter;
