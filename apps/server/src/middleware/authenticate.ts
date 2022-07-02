import type { preHandlerHookHandler as Middleware } from 'fastify';
import jwt from 'jwt-simple';
import { AccessToken } from 'components/sessions/services';
import { AuthenticationError } from 'utilities/errors';

declare module 'fastify' {
  interface FastifyRequest {
    accessToken: AccessToken;
  }
}

export interface AuthenticateOptions {
  validateExpiry?: boolean;
  requireToken?: boolean;
}

function authenticate(options?: AuthenticateOptions): Middleware {
  // Default options
  if (!options) {
    options = { requireToken: true, validateExpiry: true };
  }

  return (request, reply, next) => {
    const { authorization } = request.headers;
    request.accessToken = null as any;

    if (authorization) {
      const [schema, token] = authorization.split(' ');

      if (schema.toLowerCase() === 'bearer' && token) {
        try {
          const decodedToken: AccessToken = jwt.decode(
            token,
            process.env.SECRET as string,
          );

          if (!options?.validateExpiry || Date.now() < decodedToken.exp) {
            request.accessToken = decodedToken;

            return next();
          }
        } catch (error) {
          return new AuthenticationError('Access token is malformed');
        }
      }
    }

    if (options?.requireToken && !request.accessToken) {
      return new AuthenticationError('Access token is missing or expired');
    }

    return next();
  };
}

export default authenticate;
