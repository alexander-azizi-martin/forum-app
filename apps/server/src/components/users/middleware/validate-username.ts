import type { preHandlerHookHandler as Middleware } from 'fastify';
import { UserInputError } from 'utilities/errors';
import { UserSchemas } from 'components/users';

function validateUsername(): Middleware {
  return (req, rep, next) => {
    const { username } = req.params as { username: string };

    const { error } = UserSchemas.username.validate(username);
    if (error) {
      return new UserInputError('Invalid username');
    }

    return next();
  };
}

export default validateUsername;
