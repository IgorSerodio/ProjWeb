import { Request, Response } from 'express';
import AvaliacaoService from '../services/AvaliacaoService';
import { AuthenticatedRequest } from '../middleware/auth';

class AvaliacaoController {
  async create(req: AuthenticatedRequest, res: Response) {
    const { idDoUsuario, idDaReceita, nota, comentario } = req.body;

    if (typeof idDoUsuario !== 'number' || typeof idDaReceita !== 'number') {
      return res.status(400).json({ error: 'idDoUsuario e idDaReceita devem ser números' });
    }

    if (typeof nota !== 'number' || nota < 1 || nota > 5) {
      return res.status(400).json({ error: 'A nota deve ser um número entre 1 e 5' });
    }

    if (comentario && typeof comentario !== 'string') {
      return res.status(400).json({ error: 'Comentário deve ser uma string' });
    }

    if (req.usuario != undefined) {
      if (req.usuario.id != idDoUsuario && req.usuario.adm != true) {
        return res.status(403).json({ error: 'Acesso negado. Só é possível utilizar o id do usuário autenticado' });
      }
    }

    try {
      const avaliacaoExistente = await AvaliacaoService.findByReceitaIdAndUsuarioId(idDaReceita, idDoUsuario);
      if (avaliacaoExistente) {
        return res.status(409).json({ error: 'Um usuário só pode deixar uma avaliação por receita' });
      }
      const avaliacao = await AvaliacaoService.create({ idDoUsuario, idDaReceita, nota, comentario });
      res.status(201).json(avaliacao);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao criar avaliação' });
    }
  }

  async getByReceitaId(req: Request, res: Response) {
    const { idDaReceita } = req.params;

    if (isNaN(Number(idDaReceita))) {
      return res.status(400).json({ error: 'idDaReceita deve ser um número' });
    }

    try {
      const avaliacoes = await AvaliacaoService.findByReceitaId(Number(idDaReceita));
      res.status(200).json(avaliacoes);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao buscar avaliações' });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    const { idDoUsuario, idDaReceita } = req.params;

    if (isNaN(Number(idDoUsuario)) || isNaN(Number(idDaReceita))) {
      return res.status(400).json({ error: 'idDoUsuario e idDaReceita devem ser números' });
    }

    if (req.usuario != undefined) {
      if (req.usuario.id != idDoUsuario && req.usuario.adm != true) {
        return res.status(403).json({ error: 'Acesso negado. Só é possível utilizar o id do usuário autenticado' });
      }
    }

    const { nota, comentario } = req.body;

    if (nota && (typeof nota !== 'number' || nota < 1 || nota > 5)) {
      return res.status(400).json({ error: 'A nota deve ser um número entre 1 e 5' });
    }

    if (comentario && typeof comentario !== 'string') {
      return res.status(400).json({ error: 'Comentário deve ser uma string' });
    }

    try {
      const avaliacao = await AvaliacaoService.update(Number(idDoUsuario), Number(idDaReceita), { nota, comentario });
      if (avaliacao.count === 0) {
        return res.status(404).json({ error: 'Avaliação não encontrada para o usuário e receita especificados' });
      }
      res.status(200).json({ message: 'Avaliação atualizada com sucesso' });
    } catch (error) {
      res.status(400).json({ error: 'Erro ao atualizar avaliação' });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    const { idDoUsuario, idDaReceita } = req.params;

    if (isNaN(Number(idDoUsuario)) || isNaN(Number(idDaReceita))) {
      return res.status(400).json({ error: 'idDoUsuario e idDaReceita devem ser números' });
    }

    if (req.usuario != undefined) {
      if (req.usuario.id != idDoUsuario && req.usuario.adm != true) {
        return res.status(403).json({ error: 'Acesso negado. Só é possível utilizar o id do usuário autenticado' });
      }
    }

    try {
      const deleteCount = await AvaliacaoService.delete(Number(idDoUsuario), Number(idDaReceita));
      if (deleteCount.count === 0) {
        return res.status(404).json({ error: 'Avaliação não encontrada para o usuário e receita especificados' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Erro ao deletar avaliação' });
    }
  }
}

export default new AvaliacaoController();
