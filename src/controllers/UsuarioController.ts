import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import UsuarioService from '../services/UsuarioService';
import { AuthenticatedRequest } from '../middleware/auth';
import config from '../config';

const jwtSecretKey = config.jwtSecretKey;

class UsuarioController {

  async login(req: Request, res: Response) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
      const usuario = await UsuarioService.getByEmail(email);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const senhaCorreta = await bcrypt.compare(senha, usuario.hashSenha);
      if (!senhaCorreta) {
        return res.status(401).json({ error: 'Senha inválida' });
      }

      const token = jwt.sign({ id: usuario.id, adm: usuario.adm }, jwtSecretKey, { expiresIn: '1h' });
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao realizar login' });
    }
  }

  async create(req: Request, res: Response) {
    const { email, senha, apelido, adm } = req.body;

    if (!email || !senha || !apelido) {
      return res.status(400).json({ error: 'Email, senha e apelido são obrigatórios' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Formato de email inválido' });
    }

    const apelidoRegex = /^[A-Za-z_][A-Za-z0-9_]{2,}$/;
    if (!apelidoRegex.test(apelido)) {
      return res.status(400).json({ error: 'Apelido deve começar com uma letra e ter pelo menos 3 caracteres' });
    }

    if (senha.length < 8) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres' });
    }

    try {
      const usuarioExistente = await UsuarioService.getByEmail(email);
      if (usuarioExistente) {
        return res.status(409).json({ error: 'Já existe um usuário com este e-mail' });
      }

      const hashSenha = await bcrypt.hash(senha, 10);
      const usuario = await UsuarioService.create({ email, hashSenha, apelido, adm });
      res.status(201).json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  }

  async getByEmail(req: Request, res: Response) {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    try {
      const usuario = await UsuarioService.getByEmail(email);

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuário por email' });
    }
  }

  async getById(req: Request, res: Response) {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    try {
      const usuario = await UsuarioService.getById(parseInt(id));

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    if (req.usuario != undefined) {
      if (req.usuario.id != id && req.usuario.adm != true) {
        return res.status(403).json({ error: 'Acesso negado. Só é possível utilizar o id do usuário autenticado' });
      }
    }

    const { senha, apelido } = req.body;

    if (!senha || !apelido) {
      return res.status(400).json({ error: 'Senha e apelido são obrigatórios' });
    }

    const apelidoRegex = /^[A-Za-z_][A-Za-z0-9_]{2,}$/;
    if (!apelidoRegex.test(apelido)) {
      return res.status(400).json({ error: 'Apelido deve começar com uma letra e ter pelo menos 3 caracteres' });
    }

    if (senha.length < 8) {
      return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres' });
    }

    try {
      const hashSenha = await bcrypt.hash(senha, 10);
      const usuario = await UsuarioService.update(parseInt(id), { hashSenha, apelido });
      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  }
}

export default new UsuarioController();
