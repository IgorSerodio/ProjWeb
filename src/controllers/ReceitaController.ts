import { Request, Response } from 'express';
import ReceitaService from '../services/ReceitaService';
import { AuthenticatedRequest } from '../middleware/auth';

class ReceitaController {

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { nome, descricao, idDoUsuario, ingredientes } = req.body;

      if ((!nome && typeof nome !== 'string') || !descricao || !idDoUsuario || !ingredientes) {
        return res.status(400).json({ error: 'Nome, descrição, idDoUsuario e ingredientes são obrigatórios' });
      }

      if (typeof nome !== 'string' || nome.trim() === '') {
        return res.status(400).json({ error: 'Nome da receita tem que ser uma string e não pode ser vazio' });
      }

      if (!idDoUsuario || isNaN(idDoUsuario)) {
        return res.status(400).json({ error: 'ID do usuário inválido' });
      }

      if (req.usuario != undefined) {
        if (req.usuario.id != idDoUsuario && req.usuario.adm !== true) {
          return res.status(403).json({ error: 'Acesso negado. Só é possível utilizar o id do usuário autenticado' });
        }
      }

      if (!Array.isArray(ingredientes) || !ingredientes.every(item => typeof item === 'object' && typeof item.nomeDoIngrediente === 'string' && typeof item.quantidade === 'number')) {
        return res.status(400).json({ error: 'Ingredientes devem ser um array de objetos com { nomeDoIngrediente: string, quantidade: number }' });
      }

      const receita = await ReceitaService.create({ nome, descricao, idDoUsuario, ingredientes });
      res.status(201).json(receita);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar receita' });
    }
  }

  async getByUsuarioId(req: Request, res: Response) {
    try {
      const { idDoUsuario } = req.params;

      if (!idDoUsuario || isNaN(Number(idDoUsuario))) {
        return res.status(400).json({ error: 'ID do usuário inválido' });
      }

      const receitas = await ReceitaService.getByUsuarioId(parseInt(idDoUsuario));

      if (receitas.length === 0) {
        return res.status(404).json({ error: 'Nenhuma receita encontrada para o usuário' });
      }

      res.status(200).json(receitas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar receitas do usuário' });
    }
  }

  async getByIngredientes(req: Request, res: Response) {
    try {
      const { ingredientes } = req.query;

      if (!ingredientes || typeof ingredientes !== 'string') {
        return res.status(400).json({ error: 'Ingredientes são obrigatórios e devem ser uma string' });
      }

      const receitas = await ReceitaService.getByIngredientes(ingredientes as string);

      if (receitas.length === 0) {
        return res.status(404).json({ error: 'Nenhuma receita encontrada com esses ingredientes' });
      }

      res.status(200).json(receitas);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar receitas por ingredientes' });
    }
  }

  async update(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: 'ID da receita inválido' });
      }

      const receita = await ReceitaService.getById(parseInt(id));

      if (!receita) {
        return res.status(404).json({ error: 'Receita não encontrada' });
      }

      if (req.usuario != undefined) {
        if (req.usuario.id != receita.idDoUsuario && req.usuario.adm !== true) {
          return res.status(403).json({ error: 'Acesso negado. Só é possível utilizar o id do usuário autenticado' });
        }
      }

      const { nome, descricao, ingredientes } = req.body;

      if ((!nome && typeof nome !== 'string') || !descricao || !ingredientes) {
        return res.status(400).json({ error: 'Nome, descrição e ingredientes são obrigatórios' });
      }

      if (typeof nome !== 'string' || nome.trim() === '') {
        return res.status(400).json({ error: 'Nome da receita tem que ser uma string e não pode ser vazio' });
      }

      if (!Array.isArray(ingredientes) || !ingredientes.every(item => typeof item === 'object' && typeof item.nomeDoIngrediente === 'string' && typeof item.quantidade === 'number')) {
        return res.status(400).json({ error: 'Ingredientes devem ser um array de objetos com { nomeDoIngrediente: string, quantidade: number }' });
      }

      const receitaAtualizada = await ReceitaService.update(parseInt(id), { nome, descricao, ingredientes });
      return res.status(200).json(receitaAtualizada);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar receita' });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: 'ID da receita inválido' });
      }

      const receita = await ReceitaService.getById(parseInt(id));

      if (!receita) {
        return res.status(404).json({ error: 'Receita não encontrada' });
      }
 
      if (req.usuario != undefined) {
        if (req.usuario.id != receita.idDoUsuario && req.usuario.adm !== true) {
          return res.status(403).json({ error: 'Acesso negado. Só é possível utilizar o id do usuário autenticado' });
        }
      }

      await ReceitaService.delete(parseInt(id));
      res.status(200).json({
        message: "Receita deletada com sucesso"
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar receita' });
    }
  }
}

export default new ReceitaController();
