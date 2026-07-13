import jwt, { type JwtPayload } from 'jsonwebtoken';

const ISSUER = 'security-lab';
const AUDIENCE = 'security-lab-client';

export function requireJwtSecret(env: NodeJS.ProcessEnv = process.env): string {
  const secret = env.JWT_SECRET;
  if (!secret || secret.length < 24) throw new Error('JWT_SECRET_MISSING_OR_WEAK');
  return secret;
}

export function signAccessToken(subject: string, role: string, secret = requireJwtSecret()): string {
  return jwt.sign({ role }, secret, {
    algorithm: 'HS256', issuer: ISSUER, audience: AUDIENCE, subject, expiresIn: '5m',
  });
}

export function verifyAccessToken(token: string, secret = requireJwtSecret()): JwtPayload {
  const payload = jwt.verify(token, secret, {
    algorithms: ['HS256'], issuer: ISSUER, audience: AUDIENCE,
  });
  if (typeof payload === 'string') throw new Error('INVALID_TOKEN_PAYLOAD');
  return payload;
}

