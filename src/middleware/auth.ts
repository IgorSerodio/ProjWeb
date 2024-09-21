import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';

const jwtSecretKey = config.jwtSecretKey;

export interface AuthenticatedRequest extends Request {
  usuario?: JwtPayload;
}

export function autenticarToken(necessitaAdm: boolean = false) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
      const tokenValido = jwt.verify(token, jwtSecretKey) as JwtPayload;
      req.usuario = tokenValido; 

      if (necessitaAdm && tokenValido.adm !== true) {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem acessar.' });
      }

      next();
    } catch (err) {
      console.log(err);
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
  };
}