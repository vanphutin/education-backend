import bcrypt from 'bcrypt';

export async function hashPassword(password: string, rounds = 10): Promise<string> {
  if (password.length < 12) throw new TypeError('PASSWORD_TOO_SHORT');
  return bcrypt.hash(password, rounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

