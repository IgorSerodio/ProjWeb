import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;

interface AuthenticatedRequest extends Request {
  usuario?: string | JwtPayload;
}

export function autenticarToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const tokenValido = jwt.verify(token, SECRET_KEY);
    req.usuario = tokenValido; 
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
}