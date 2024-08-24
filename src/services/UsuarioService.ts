import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class UsuarioService {
  async create(data: { email: string; hashSenha: string; apelido: string; adm: boolean }) {
    return prisma.usuario.create({ data });
  }

  async getByEmail(email: string) {
    return prisma.usuario.findUnique({ where: { email } });
  }

  async getById(id: number) {
    return prisma.usuario.findUnique({ where: { id } });
  }

  async update(id: number, data: { hashSenha: string; apelido: string }) {
    return prisma.usuario.update({ where: { id }, data });
  }
}

export default new UsuarioService();