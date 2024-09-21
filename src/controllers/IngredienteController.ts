import { Request, Response } from 'express';
import IngredienteService from '../services/IngredienteService';
import {tipoDeMedidaConst} from '../services/IngredienteService';

class IngredienteController {
  async getAll(req: Request, res: Response) {
    try {
      const ingredientes = await IngredienteService.getAll();
      res.status(200).json(ingredientes);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar ingredientes' });
    }
  }

  async getByNome(req: Request, res: Response) {
    const { nome } = req.params;

    if (!nome || typeof nome !== 'string' || nome.trim() === '') {
      return res.status(400).json({ error: 'Nome do ingrediente é obrigatório e deve ser uma string não vazia' });
    }

    try {
      const ingrediente = await IngredienteService.getByNome(nome);

      if (!ingrediente) {
        return res.status(404).json({ error: 'Ingrediente não encontrado' });
      }

      res.status(200).json(ingrediente);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar ingrediente pelo nome' });
    }
  }

  async create(req: Request, res: Response) {
    const { nome, tipoDeMedida } = req.body;

    if (!nome || typeof nome !== 'string' || nome.trim() === '') {
      return res.status(400).json({ error: 'Nome do ingrediente é obrigatório e deve ser uma string não vazia' });
    }

    if (!tipoDeMedida || !(Object.values(tipoDeMedidaConst).includes(tipoDeMedida))) {
      return res.status(400).json({ error: 'Tipo de medida ausente ou inválido' });
    }

    try {
      const ingredienteExistente = await IngredienteService.getByNome(nome);
      if (ingredienteExistente) {
        return res.status(409).json({ error: 'Ingrediente com o mesmo nome já existe' });
      }
      const ingrediente = await IngredienteService.create({ nome, tipoDeMedida });
      res.status(201).json(ingrediente);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar ingrediente' });
    }
  }

  async delete(req: Request, res: Response) {
    const { nome } = req.params;

    if (!nome || typeof nome !== 'string' || nome.trim() === '') {
      return res.status(400).json({ error: 'Nome do ingrediente é obrigatório e deve ser uma string não vazia' });
    }

    try {
      const ingrediente = await IngredienteService.getByNome(nome);

      if (!ingrediente) {
        return res.status(404).json({ error: 'Ingrediente não encontrado' });
      }

      await IngredienteService.delete(nome);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar ingrediente' });
    }
  }
}

export default new IngredienteController();
