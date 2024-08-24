import { Request, Response } from 'express';
import IngredienteService from '../services/IngredienteService';

class IngredienteController {
  async getAll(req: Request, res: Response) {
    try {
      const ingredientes = await IngredienteService.getAll();
      res.json(ingredientes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar ingredientes' });
    }
  }

  async getByNome(req: Request, res: Response) {
    try {
      const { nome } = req.params;
      const ingrediente = await IngredienteService.getByNome(nome);
      res.json(ingrediente);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar ingrediente pelo nome' });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { nome, tipoDeMedida } = req.body;
      const ingrediente = await IngredienteService.create({ nome, tipoDeMedida });
      res.status(201).json(ingrediente);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar ingrediente' });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { nome } = req.params;
      await IngredienteService.delete(nome);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar ingrediente' });
    }
  }
}

export default new IngredienteController();
