import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class IngredienteReceitaService {
  async createMany(ingredientes: { idDaReceita: number; nomeDoIngrediente: string; quantidade: number }[]) {
    return prisma.ingredienteReceita.createMany({ data: ingredientes });
  }

  async deleteByReceitaId(idDaReceita: number) {
    return prisma.ingredienteReceita.deleteMany({ where: { idDaReceita } });
  }

  async findByReceitaId(idDaReceita: number) {
    return prisma.ingredienteReceita.findMany({ where: { idDaReceita }, include: { ingrediente: true } });
  }

  async findByIngredientes(ingredientesList: string[]) {
    return prisma.receita.findMany({
      where: {
        ingredientesReceita: {
          some: { nomeDoIngrediente: { in: ingredientesList } }
        },
      },
      include: {
        ingredientesReceita: {
          include: { ingrediente: true }
        }
      }
    });
  }
}

export default new IngredienteReceitaService();