import { PrismaClient } from '@prisma/client';
import IngredienteReceitaService from './IngredienteReceitaService';

const prisma = new PrismaClient();

class ReceitaService {
  async create(data: { nome: string; descricao: string; idDoUsuario: number; ingredientes: { nomeDoIngrediente: string, quantidade: number }[] }) {
    const receita = await prisma.receita.create({ data: { nome: data.nome, descricao: data.descricao, idDoUsuario: data.idDoUsuario } });
    const ingredientesReceita = data.ingredientes.map(ingrediente => ({
      idDaReceita: receita.id,
      nomeDoIngrediente: ingrediente.nomeDoIngrediente,
      quantidade: ingrediente.quantidade,
    }));
    await IngredienteReceitaService.createMany(ingredientesReceita);
    return { ...receita, ingredientesReceita };
  }

  async getByUsuarioId(idDoUsuario: number) {
    const receitas = await prisma.receita.findMany({ where: { idDoUsuario } });
    for (let receita of receitas) {
      receita['ingredientesReceita'] = await IngredienteReceitaService.findByReceitaId(receita.id);
    }
    return receitas;
  }

  async getByIngredientes(ingredientes: string) {
    const ingredientesList = ingredientes.split(',').map(nome => nome.trim());
    return IngredienteReceitaService.findByIngredientes(ingredientesList);
  }

  async update(id: number, data: { nome: string; descricao: string; ingredientes: { nomeDoIngrediente: string, quantidade: number }[] }) {
    await IngredienteReceitaService.deleteByReceitaId(id);
    const receita = await prisma.receita.update({ where: { id }, data: { nome: data.nome, descricao: data.descricao } });
    const ingredientesReceita = data.ingredientes.map(ingrediente => ({
      idDaReceita: receita.id,
      nomeDoIngrediente: ingrediente.nomeDoIngrediente,
      quantidade: ingrediente.quantidade,
    }));
    await IngredienteReceitaService.createMany(ingredientesReceita);
    return { ...receita, ingredientesReceita };
  }

  async delete(id: number) {
    await IngredienteReceitaService.deleteByReceitaId(id);
    await prisma.receita.delete({ where: { id } });
  }
}

export default new ReceitaService();
