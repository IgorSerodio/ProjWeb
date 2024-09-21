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
      const avaliacaoExistente = await AvaliacaoService.findByUsuarioIdAndReceitaId(idDoUsuario, idDaReceita);
      if (avaliacaoExistente) {
        return res.status(409).json({ error: 'Um usuário só pode deixar uma avaliação por receita' });
      }
      const avaliacao = await AvaliacaoService.create({ idDoUsuario, idDaReceita, nota, comentario });
      res.status(201).json(avaliacao);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar avaliação' });
    }
  }

  async getByReceitaId(req: Request, res: Response) {
    const { idDaReceita } = req.params;

    if (isNaN(parseInt(idDaReceita))) {
      return res.status(400).json({ error: 'idDaReceita deve ser um número' });
    }

    try {
      const avaliacoes = await AvaliacaoService.findByReceitaId(parseInt(idDaReceita));
      return res.status(200).json(avaliacoes);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao buscar avaliações' });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    const { idDoUsuario, idDaReceita } = req.params;

    if (isNaN(parseInt(idDoUsuario)) || isNaN(parseInt(idDaReceita))) {
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
      const avaliacao = await AvaliacaoService.findByUsuarioIdAndReceitaId(parseInt(idDoUsuario), parseInt(idDaReceita));
      if (!avaliacao) {
        return res.status(404).json({ error: 'Avaliação não encontrada para o usuário e receita especificados' });
      }
      const avaliacaoAtualizada = await AvaliacaoService.update(parseInt(idDoUsuario), parseInt(idDaReceita), { nota, comentario });
      res.status(200).json(avaliacaoAtualizada);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar avaliação' });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    const { idDoUsuario, idDaReceita } = req.params;

    if (isNaN(parseInt(idDoUsuario)) || isNaN(parseInt(idDaReceita))) {
      return res.status(400).json({ error: 'idDoUsuario e idDaReceita devem ser números' });
    }

    if (req.usuario != undefined) {
      if (req.usuario.id != idDoUsuario && req.usuario.adm != true) {
        return res.status(403).json({ error: 'Acesso negado. Só é possível utilizar o id do usuário autenticado' });
      }
    }

    try {
      const avaliacao = await AvaliacaoService.findByUsuarioIdAndReceitaId(parseInt(idDoUsuario), parseInt(idDaReceita));
      if (!avaliacao) {
        return res.status(404).json({ error: 'Avaliação não encontrada para o usuário e receita especificados' });
      }
      await AvaliacaoService.delete(parseInt(idDoUsuario), parseInt(idDaReceita));
      res.status(200).json({message: "Avaliação deletada com sucesso"});
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar avaliação' });
    }
  }
}

export default new AvaliacaoController();
