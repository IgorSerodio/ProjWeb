import { Request, Response } from 'express';
import ReceitaService from '../services/ReceitaService';

class ReceitaController {
  async create(req: Request, res: Response) {
    try {
      const { nome, descricao, idDoUsuario, ingredientes } = req.body;
      const receita = await ReceitaService.create({ nome, descricao, idDoUsuario, ingredientes });
      res.status(201).json(receita);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar receita' });
    }
  }

  async getByUsuarioId(req: Request, res: Response) {
    try {
      const { idDoUsuario } = req.params;
      const receitas = await ReceitaService.getByUsuarioId(parseInt(idDoUsuario));
      res.json(receitas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar receitas do usuário' });
    }
  }

  async getByIngredientes(req: Request, res: Response) {
    try {
      const { ingredientes } = req.query;
      const receitas = await ReceitaService.getByIngredientes(ingredientes as string);
      res.json(receitas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar receitas por ingredientes' });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { nome, descricao, ingredientes } = req.body;
      const receita = await ReceitaService.update(parseInt(id), { nome, descricao, ingredientes });
      res.json(receita);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar receita' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ReceitaService.delete(parseInt(id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar receita' });
    }
  }
}

export default new ReceitaController();
