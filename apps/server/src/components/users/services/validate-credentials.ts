import bcrypt from 'bcrypt';
import prisma from 'config/prisma';

async function validateCredentials(username: string, password: string) {
  const user = await prisma.users.findUnique({ where: { username } });

  if (user && bcrypt.compareSync(password, user.password)) {
    return user.userId;
  }

  return null;
}

export default validateCredentials;
