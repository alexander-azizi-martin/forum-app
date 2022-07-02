import type { preHandlerHookHandler as Middleware } from 'fastify';
import type { Schema } from 'joi';
import { UserInputError } from 'utilities/errors';

function validateBody(schema: Schema): Middleware {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      allowUnknown: false,
      convert: false,
      errors: { wrap: { label: '' } },
    });

    if (error) {
      return new UserInputError(error.message);
    }

    return next();
  };
}

export default validateBody;
