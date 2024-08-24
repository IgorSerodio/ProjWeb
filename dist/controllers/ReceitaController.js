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
const ReceitaService_1 = __importDefault(require("../services/ReceitaService"));
class ReceitaController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nome, descricao, idDoUsuario, ingredientes } = req.body;
                const receita = yield ReceitaService_1.default.create({ nome, descricao, idDoUsuario, ingredientes });
                res.status(201).json(receita);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao criar receita' });
            }
        });
    }
    getByUsuarioId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { idDoUsuario } = req.params;
                const receitas = yield ReceitaService_1.default.getByUsuarioId(parseInt(idDoUsuario));
                res.json(receitas);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao buscar receitas do usuário' });
            }
        });
    }
    getByIngredientes(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ingredientes } = req.query;
                const receitas = yield ReceitaService_1.default.getByIngredientes(ingredientes);
                res.json(receitas);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao buscar receitas por ingredientes' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { nome, descricao, ingredientes } = req.body;
                const receita = yield ReceitaService_1.default.update(parseInt(id), { nome, descricao, ingredientes });
                res.json(receita);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao atualizar receita' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield ReceitaService_1.default.delete(parseInt(id));
                res.status(204).send();
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao deletar receita' });
            }
        });
    }
}
exports.default = new ReceitaController();
