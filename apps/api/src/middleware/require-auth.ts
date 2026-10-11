import type { Request, Response, NextFunction } from 'express';
import type { DbUser } from '@prisma/client';
import { adminAuth } from '../lib/firebase-admin.js';
import { upsertUser } from '../services/user.service.js';
import { tokenClaimsSchema } from '../schemas/auth.schema.js';

declare module 'express' {
  interface Request {
    user?: DbUser;
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Missing or malformed Authorization header' });
  }
  const token = authHeader.slice('Bearer '.length);

  let claims;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    claims = tokenClaimsSchema.parse(decoded);
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  const user = await upsertUser({
    firebaseId: claims.uid,
    email: claims.email,
  });
  req.user = user;
  next();
};
