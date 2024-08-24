"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AvaliacaoService {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.avaliacao.create({ data });
        });
    }
    findByReceitaId(idDaReceita) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.avaliacao.findMany({
                where: { idDaReceita },
                include: { usuario: true }
            });
        });
    }
    update(idDoUsuario, idDaReceita, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.avaliacao.updateMany({
                where: { idDoUsuario, idDaReceita },
                data
            });
        });
    }
    delete(idDoUsuario, idDaReceita) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.avaliacao.deleteMany({
                where: { idDoUsuario, idDaReceita }
            });
        });
    }
}
exports.default = new AvaliacaoService();