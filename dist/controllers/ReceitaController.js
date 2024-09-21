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
                if ((!nome && typeof nome !== 'string') || !descricao || !idDoUsuario || !ingredientes) {
                    return res.status(400).json({ error: 'Nome, descrição, idDoUsuario e ingredientes são obrigatórios' });
                }
                if (typeof nome !== 'string' || nome.trim() === '') {
                    return res.status(400).json({ error: 'Nome da receita tem que ser uma string e não pode ser vazio' });
                }
                if (!idDoUsuario || isNaN(idDoUsuario)) {
                    return res.status(400).json({ error: 'ID do usuário inválido' });
                }
                if (req.usuario != undefined) {
                    if (req.usuario.id != idDoUsuario && req.usuario.adm !== true) {
                        return res.status(403).json({ error: 'Acesso negado. Só é possível utilizar o id do usuário autenticado' });
                    }
                }
                if (!Array.isArray(ingredientes) || !ingredientes.every(item => typeof item === 'object' && typeof item.nomeDoIngrediente === 'string' && typeof item.quantidade === 'number')) {
                    return res.status(400).json({ error: 'Ingredientes devem ser um array de objetos com { nomeDoIngrediente: string, quantidade: number }' });
                }
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
                if (!idDoUsuario || isNaN(Number(idDoUsuario))) {
                    return res.status(400).json({ error: 'ID do usuário inválido' });
                }
                const receitas = yield ReceitaService_1.default.getByUsuarioId(parseInt(idDoUsuario));
                if (receitas.length === 0) {
                    return res.status(404).json({ error: 'Nenhuma receita encontrada para o usuário' });
                }
                res.status(200).json(receitas);
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
                if (!ingredientes || typeof ingredientes !== 'string') {
                    return res.status(400).json({ error: 'Ingredientes são obrigatórios e devem ser uma string' });
                }
                const receitas = yield ReceitaService_1.default.getByIngredientes(ingredientes);
                if (receitas.length === 0) {
                    return res.status(404).json({ error: 'Nenhuma receita encontrada com esses ingredientes' });
                }
                res.status(200).json(receitas);
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
                if (!id || isNaN(Number(id))) {
                    return res.status(400).json({ error: 'ID da receita inválido' });
                }
                const receita = yield ReceitaService_1.default.getById(parseInt(id));
                if (!receita) {
                    return res.status(404).json({ error: 'Receita não encontrada' });
                }
                if (req.usuario != undefined) {
                    if (req.usuario.id != receita.idDoUsuario && req.usuario.adm !== true) {
                        return res.status(403).json({ error: 'Acesso negado. Só é possível utilizar o id do usuário autenticado' });
                    }
                }
                const { nome, descricao, ingredientes } = req.body;
                if ((!nome && typeof nome !== 'string') || !descricao || !ingredientes) {
                    return res.status(400).json({ error: 'Nome, descrição e ingredientes são obrigatórios' });
                }
                if (typeof nome !== 'string' || nome.trim() === '') {
                    return res.status(400).json({ error: 'Nome da receita tem que ser uma string e não pode ser vazio' });
                }
                if (!Array.isArray(ingredientes) || !ingredientes.every(item => typeof item === 'object' && typeof item.nomeDoIngrediente === 'string' && typeof item.quantidade === 'number')) {
                    return res.status(400).json({ error: 'Ingredientes devem ser um array de objetos com { nomeDoIngrediente: string, quantidade: number }' });
                }
                const receitaAtualizada = yield ReceitaService_1.default.update(parseInt(id), { nome, descricao, ingredientes });
                return res.status(200).json(receitaAtualizada);
            }
            catch (error) {
                return res.status(500).json({ error: 'Erro ao atualizar receita' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!id || isNaN(Number(id))) {
                    return res.status(400).json({ error: 'ID da receita inválido' });
                }
                const receita = yield ReceitaService_1.default.getById(parseInt(id));
                if (!receita) {
                    return res.status(404).json({ error: 'Receita não encontrada' });
                }
                if (req.usuario != undefined) {
                    if (req.usuario.id != receita.idDoUsuario && req.usuario.adm !== true) {
                        return res.status(403).json({ error: 'Acesso negado. Só é possível utilizar o id do usuário autenticado' });
                    }
                }
                yield ReceitaService_1.default.delete(parseInt(id));
                res.status(200).json({
                    message: "Receita deletada com sucesso"
                });
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao deletar receita' });
            }
        });
    }
}
exports.default = new ReceitaController();
