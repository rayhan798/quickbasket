import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'your-secret-key';

type TokenPayload = {
  _id: string;
  email: string;
  role: string;
};

export const generateToken = (payload: TokenPayload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
};

export const getUserFromToken = async (token: string): Promise<TokenPayload | null> => {
  try {
    const decoded = jwt.verify(token, SECRET) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
};
