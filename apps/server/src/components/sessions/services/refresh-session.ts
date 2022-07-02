import prisma, { PrismaErrorCodes } from 'config/prisma';
import { AuthenticationError } from 'utilities/errors';
import { generateSession } from 'components/sessions/services';

async function refreshSession(refreshToken: string) {
  try {
    const session = await prisma.sessions.delete({
      where: { refreshToken },
    });

    const expired = session.expiration < new Date();
    if (expired) {
      return new AuthenticationError('Expired refresh token');
    }

    return await generateSession(session.userId);
  } catch (error: any) {
    if (error.code === PrismaErrorCodes.NOT_FOUND) {
      return new AuthenticationError('Invalid refresh token');
    }

    throw error;
  }
}

export default refreshSession;
