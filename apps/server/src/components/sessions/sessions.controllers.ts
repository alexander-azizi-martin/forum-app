import type { RouteHandler as Controller } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import prisma from 'config/prisma';
import { AuthenticationError } from 'utilities/errors';
import { UserSchemas, UserServices } from 'components/users';
import { SessionServices, SessionSchemas } from 'components/sessions';

export const create: Controller = async (req) => {
  const { username, password } = req.body as UserSchemas.Credentials;

  const userId = await UserServices.validateCredentials(username, password);
  if (userId) {
    return SessionServices.generateSession(userId);
  }

  return new AuthenticationError('Username and password do not match');
};

export const refresh: Controller = async (req) => {
  const { refreshToken } = req.body as SessionSchemas.RefreshToken;

  return SessionServices.refreshSession(refreshToken);
};

export const destroy: Controller = async (req, res) => {
  const { refreshToken } = req.body as SessionSchemas.RefreshToken;

  try {
    await prisma.sessions.delete({ where: { refreshToken } });
  } finally {
    res.code(StatusCodes.NO_CONTENT);
  }
};
