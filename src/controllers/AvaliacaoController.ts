import { Request, Response } from 'express';
import AvaliacaoService from '../services/AvaliacaoService';

class AvaliacaoController {
  async create(req: Request, res: Response) {
    const { idDoUsuario, idDaReceita, nota, comentario } = req.body;
    try {
      const avaliacao = await AvaliacaoService.create({ idDoUsuario, idDaReceita, nota, comentario });
      res.status(201).json(avaliacao);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao criar avaliação' });
    }
  }

  async getByReceitaId(req: Request, res: Response) {
    const { idDaReceita } = req.params;
    try {
      const avaliacoes = await AvaliacaoService.findByReceitaId(Number(idDaReceita));
      res.status(200).json(avaliacoes);
    } catch (error) {
      res.status(400).json({ error: 'Erro ao buscar avaliações' });
    }
  }

  async update(req: Request, res: Response) {
    const { idDoUsuario, idDaReceita } = req.params;
    const { nota, comentario } = req.body;
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

  async delete(req: Request, res: Response) {
    const { idDoUsuario, idDaReceita } = req.params;
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