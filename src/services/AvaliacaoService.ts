import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class AvaliacaoService {
  async create(data: { idDoUsuario: number; idDaReceita: number; nota: number; comentario?: string }) {
    return prisma.avaliacao.create({ data });
  }

  async findByReceitaId(idDaReceita: number) {
    return prisma.avaliacao.findMany({
      where: { idDaReceita },
      include: { usuario: true }
    });
  }

  async update(idDoUsuario: number, idDaReceita: number, data: { nota: number; comentario?: string }) {
    return prisma.avaliacao.updateMany({
      where: { idDoUsuario, idDaReceita },
      data
    });
  }

  async delete(idDoUsuario: number, idDaReceita: number) {
    return prisma.avaliacao.deleteMany({
      where: { idDoUsuario, idDaReceita }
    });
  }
  
}

export default new AvaliacaoService();