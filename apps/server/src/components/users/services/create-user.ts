import bcrypt from 'bcrypt';
import prisma, { PrismaErrorCodes } from 'config/prisma';
import { ConflictError } from 'utilities/errors';
import { generateSession } from 'components/sessions/services';

const SALT_ROUNDS = 10;

async function createUser(username: string, password: string) {
  try {
    const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);

    const { userId } = await prisma.users.create({
      data: { username, password: passwordHash },
    });

    return await generateSession(userId);
  } catch (error: any) {
    if (error.code === PrismaErrorCodes.CONFLICT) {
      return new ConflictError('Username taken');
    }

    throw error;
  }
}

export default createUser;
