import { PrismaClient, IngredienteReceita, Receita} from '@prisma/client';
import IngredienteReceitaService from './IngredienteReceitaService';

const prisma = new PrismaClient();

interface ReceitaRes {
  id: number;
  nome: string;
  descricao: string | null;
  idDoUsuario: number;
  ingredientesReceita: IngredienteReceita[]
}

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
    const receitas = await prisma.receita.findMany({ 
      where: { idDoUsuario }, 
      include: {
        ingredientesReceita: {
          include: { ingrediente: true }
        }
      } 
    });
    return receitas;
  }

  async getById(id: number) {
    const receita = await prisma.receita.findUnique({ 
      where: { id }, 
      include: {
        ingredientesReceita: {
          include: { ingrediente: true }
        }
      } 
    });
    return receita;
  }

  async getByIngredientes(ingredientes: string) {
    const ingredientesList = ingredientes.split(',').map(nome => nome.trim());
    return prisma.receita.findMany({
      where: {
        ingredientesReceita: {
          every: { nomeDoIngrediente: { in: ingredientesList } }
        },
      },
      include: {
        ingredientesReceita: true
      }
    });
  }

  async update(id: number, data: { nome: string; descricao: string; ingredientes: { nomeDoIngrediente: string, quantidade: number }[] }) {
    await IngredienteReceitaService.deleteByReceitaId(id);
    const ingredientesReceita = data.ingredientes.map(ingrediente => ({
      idDaReceita: id,
      nomeDoIngrediente: ingrediente.nomeDoIngrediente,
      quantidade: ingrediente.quantidade,
    }));
    await IngredienteReceitaService.createMany(ingredientesReceita);
    const receita = await prisma.receita.update({ 
      where: { 
        id 
      }, 
      data: { 
        nome: data.nome, 
        descricao: data.descricao 
      },
      include: {
        ingredientesReceita: true
      }
    });
    return {receita};
  }

  async delete(id: number) {
    await IngredienteReceitaService.deleteByReceitaId(id);
    await prisma.receita.delete({ where: { id } });
  }
}

export default new ReceitaService();
