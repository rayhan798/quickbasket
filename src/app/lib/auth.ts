import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

export type UserPayload = {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
};

export function generateToken(payload: UserPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, SECRET) as UserPayload;
  } catch {
    return null;
  }
}

// ✅ এইটা যোগ করো
export function getUserFromToken(token: string): UserPayload | null {
  return verifyToken(token);
}
