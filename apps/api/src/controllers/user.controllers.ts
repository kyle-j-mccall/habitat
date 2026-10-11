import type { Request, Response } from 'express';

export const me = (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return res.json(req.user);
};
