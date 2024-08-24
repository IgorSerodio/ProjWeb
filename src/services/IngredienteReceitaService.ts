import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class IngredienteReceitaService {
  async createMany(ingredientes: { idDaReceita: number; nomeDoIngrediente: string; quantidade: number }[]) {
    return prisma.ingredienteReceita.createMany({ data: ingredientes });
  }

  async deleteByReceitaId(idDaReceita: number) {
    return prisma.ingredienteReceita.deleteMany({ where: { idDaReceita } });
  }
}

export default new IngredienteReceitaService();