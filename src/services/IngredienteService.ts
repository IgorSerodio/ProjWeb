import { PrismaClient, TipoDeMedida} from '@prisma/client';

const prisma = new PrismaClient();

class IngredienteService {
  async getAll() {
    return prisma.ingrediente.findMany();
  }

  async getByNome(nome: string) {
    return prisma.ingrediente.findUnique({ where: { nome } });
  }

  async create(data: { nome: string, tipoDeMedida: TipoDeMedida}) {
    return prisma.ingrediente.create({ data });
  }

  async delete(nome: string) {
    await prisma.ingrediente.delete({ where: { nome } });
  }
}

export const tipoDeMedidaConst = TipoDeMedida;

export default new IngredienteService();