import jwt from 'jwt-simple';
import ms from 'ms';
import prisma from 'config/prisma';
import { AuthenticationError } from 'utilities/errors';

export interface AccessToken {
  sub: string;
  iat: number;
  exp: number;
}

async function generateSession(userId: string) {
  try {
    const { refreshToken } = await prisma.sessions.create({
      data: { userId },
    });

    const accessToken = jwt.encode(
      {
        sub: userId,
        iat: Date.now(),
        exp: Date.now() + ms('5 minutes'),
      },
      process.env.SECRET as string,
    );

    return { refreshToken, accessToken };
  } catch {
    return new AuthenticationError('Invalid user id');
  }
}

export default generateSession;
