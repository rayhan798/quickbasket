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

// ✅ নতুন ফাংশন যোগ করা হলো
export const verifyToken = (token: string): TokenPayload => {
  if (!token) throw new Error('No token provided');

  try {
    const decoded = jwt.verify(token, SECRET) as TokenPayload;
    return decoded;
  } catch (err) {
    throw new Error('Invalid token');
  }
};
