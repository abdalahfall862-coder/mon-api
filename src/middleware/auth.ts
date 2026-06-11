import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    res.status(401).json({ error: 'Token manquant' });
    return;
  }

  const token = authHeader.replace('Bearer ', '');
  
  if (!token) {
    res.status(401).json({ error: 'Format token invalide' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};