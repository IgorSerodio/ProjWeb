import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import UsuarioService from '../services/UsuarioService';

const SECRET_KEY = process.env.SECRET_KEY;

class UsuarioController {

  async login(req: Request, res: Response) {
    const { email, senha } = req.body;

    try {
      const usuario = await UsuarioService.getByEmail(email);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.hashSenha);
      if (!senhaCorreta) {
        return res.status(401).json({ error: 'Senha inválida' });
      }

      const token = jwt.sign({ id: usuario.id, email: usuario.email }, SECRET_KEY, { expiresIn: '1h' });
      return res.json({ token });
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao realizar login' });
    }
  }
  
  async create(req: Request, res: Response) {
    try {
      const { email, senha, apelido, adm } = req.body;
      const hashSenha = await bcrypt.hash(senha, 10);
      const usuario = await UsuarioService.create({ email, hashSenha, apelido, adm });
      res.status(201).json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  }

  async getByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const usuario = await UsuarioService.getByEmail(email);
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuário por email' });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usuario = await UsuarioService.getById(parseInt(id));
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { hashSenha, apelido } = req.body;
      const usuario = await UsuarioService.update(parseInt(id), { hashSenha, apelido });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  }
}

export default new UsuarioController();
