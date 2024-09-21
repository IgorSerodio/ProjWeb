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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const IngredienteReceitaService_1 = __importDefault(require("./IngredienteReceitaService"));
const AvaliacaoService_1 = __importDefault(require("./AvaliacaoService"));
const prisma = new client_1.PrismaClient();
class ReceitaService {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const receita = yield prisma.receita.create({ data: { nome: data.nome, descricao: data.descricao, idDoUsuario: data.idDoUsuario } });
            const ingredientesReceita = data.ingredientes.map(ingrediente => ({
                idDaReceita: receita.id,
                nomeDoIngrediente: ingrediente.nomeDoIngrediente,
                quantidade: ingrediente.quantidade,
            }));
            yield IngredienteReceitaService_1.default.createMany(ingredientesReceita);
            return Object.assign(Object.assign({}, receita), { ingredientesReceita });
        });
    }
    getByUsuarioId(idDoUsuario) {
        return __awaiter(this, void 0, void 0, function* () {
            const receitas = yield prisma.receita.findMany({
                where: { idDoUsuario },
                include: {
                    ingredientesReceita: {
                        include: { ingrediente: true }
                    }
                }
            });
            return receitas;
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const receita = yield prisma.receita.findUnique({
                where: { id },
                include: {
                    ingredientesReceita: {
                        include: { ingrediente: true }
                    }
                }
            });
            return receita;
        });
    }
    getByIngredientes(ingredientes) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield IngredienteReceitaService_1.default.deleteByReceitaId(id);
            const ingredientesReceita = data.ingredientes.map(ingrediente => ({
                idDaReceita: id,
                nomeDoIngrediente: ingrediente.nomeDoIngrediente,
                quantidade: ingrediente.quantidade,
            }));
            yield IngredienteReceitaService_1.default.createMany(ingredientesReceita);
            const receita = yield prisma.receita.update({
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
            return receita;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield AvaliacaoService_1.default.deleteByReceitaId(id);
            yield IngredienteReceitaService_1.default.deleteByReceitaId(id);
            yield prisma.receita.delete({ where: { id } });
        });
    }
}
exports.default = new ReceitaService();
