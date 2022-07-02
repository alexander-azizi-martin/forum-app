import type { RouteHandler as Controller } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import prisma from 'config/prisma';
import {
  UserInputError,
  NotFoundError,
  ForbiddenError,
} from 'utilities/errors';
import { UserSchemas } from 'components/users';
import { createUser } from 'components/users/services';

export const create: Controller = async (req) => {
  const { username, password } = req.body as UserSchemas.Credentials;

  return createUser(username, password);
};

export const show: Controller = async (req) => {
  const { username } = req.params as { username: string };

  const user = prisma.users.findUnique({
    where: { username },
    select: {
      username: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return new NotFoundError(`${username} does not exist`);
  }

  return user;
};

export const showMe: Controller = async (req) => {
  const { sub: userId } = req.accessToken;

  const user = prisma.users.findUnique({
    where: { userId },
    select: {
      username: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return new NotFoundError('Account no longer exists');
  }

  return user;
};

export const destroy: Controller = async (req, res) => {
  const { username } = req.params as { username: string };
  const { sub: userId } = req.accessToken;

  const user = await prisma.users.findUnique({ where: { userId } });

  if (!user) {
    return new NotFoundError(`${username} does not exist`);
  } else if (user.username !== username) {
    return new ForbiddenError('You do not have permission to delete this user');
  }

  try {
    await prisma.users.delete({ where: { userId, username } });

    res.code(StatusCodes.NO_CONTENT);
  } catch (error: any) {
    throw error;
  }
};
