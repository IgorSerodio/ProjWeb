import { Request, Response } from 'express';
import UsuarioService from '../services/UsuarioService';

class UsuarioController {
  async create(req: Request, res: Response) {
    try {
      const { email, hashSenha, apelido, adm } = req.body;
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
