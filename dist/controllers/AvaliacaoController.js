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
const AvaliacaoService_1 = __importDefault(require("../services/AvaliacaoService"));
class AvaliacaoController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idDoUsuario, idDaReceita, nota, comentario } = req.body;
            if (typeof idDoUsuario !== 'number' || typeof idDaReceita !== 'number') {
                return res.status(400).json({ error: 'idDoUsuario e idDaReceita devem ser números' });
            }
            if (typeof nota !== 'number' || nota < 1 || nota > 5) {
                return res.status(400).json({ error: 'A nota deve ser um número entre 1 e 5' });
            }
            if (comentario && typeof comentario !== 'string') {
                return res.status(400).json({ error: 'Comentário deve ser uma string' });
            }
            if (req.usuario != undefined) {
                if (req.usuario.id != idDoUsuario && req.usuario.adm != true) {
                    return res.status(403).json({ error: 'Acesso negado. Só é possível utilizar o id do usuário autenticado' });
                }
            }
            try {
                const avaliacaoExistente = yield AvaliacaoService_1.default.findByUsuarioIdAndReceitaId(idDoUsuario, idDaReceita);
                if (avaliacaoExistente) {
                    return res.status(409).json({ error: 'Um usuário só pode deixar uma avaliação por receita' });
                }
                const avaliacao = yield AvaliacaoService_1.default.create({ idDoUsuario, idDaReceita, nota, comentario });
                res.status(201).json(avaliacao);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao criar avaliação' });
            }
        });
    }
    getByReceitaId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idDaReceita } = req.params;
            if (isNaN(parseInt(idDaReceita))) {
                return res.status(400).json({ error: 'idDaReceita deve ser um número' });
            }
            try {
                const avaliacoes = yield AvaliacaoService_1.default.findByReceitaId(parseInt(idDaReceita));
                return res.status(200).json(avaliacoes);
            }
            catch (error) {
                res.status(400).json({ error: 'Erro ao buscar avaliações' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idDoUsuario, idDaReceita } = req.params;
            if (isNaN(parseInt(idDoUsuario)) || isNaN(parseInt(idDaReceita))) {
                return res.status(400).json({ error: 'idDoUsuario e idDaReceita devem ser números' });
            }
            if (req.usuario != undefined) {
                if (req.usuario.id != idDoUsuario && req.usuario.adm != true) {
                    return res.status(403).json({ error: 'Acesso negado. Só é possível utilizar o id do usuário autenticado' });
                }
            }
            const { nota, comentario } = req.body;
            if (nota && (typeof nota !== 'number' || nota < 1 || nota > 5)) {
                return res.status(400).json({ error: 'A nota deve ser um número entre 1 e 5' });
            }
            if (comentario && typeof comentario !== 'string') {
                return res.status(400).json({ error: 'Comentário deve ser uma string' });
            }
            try {
                const avaliacao = yield AvaliacaoService_1.default.findByUsuarioIdAndReceitaId(parseInt(idDoUsuario), parseInt(idDaReceita));
                if (!avaliacao) {
                    return res.status(404).json({ error: 'Avaliação não encontrada para o usuário e receita especificados' });
                }
                const avaliacaoAtualizada = yield AvaliacaoService_1.default.update(parseInt(idDoUsuario), parseInt(idDaReceita), { nota, comentario });
                res.status(200).json(avaliacaoAtualizada);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao atualizar avaliação' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idDoUsuario, idDaReceita } = req.params;
            if (isNaN(parseInt(idDoUsuario)) || isNaN(parseInt(idDaReceita))) {
                return res.status(400).json({ error: 'idDoUsuario e idDaReceita devem ser números' });
            }
            if (req.usuario != undefined) {
                if (req.usuario.id != idDoUsuario && req.usuario.adm != true) {
                    return res.status(403).json({ error: 'Acesso negado. Só é possível utilizar o id do usuário autenticado' });
                }
            }
            try {
                const avaliacao = yield AvaliacaoService_1.default.findByUsuarioIdAndReceitaId(parseInt(idDoUsuario), parseInt(idDaReceita));
                if (!avaliacao) {
                    return res.status(404).json({ error: 'Avaliação não encontrada para o usuário e receita especificados' });
                }
                yield AvaliacaoService_1.default.delete(parseInt(idDoUsuario), parseInt(idDaReceita));
                res.status(200).json({ message: "Avaliação deletada com sucesso" });
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao deletar avaliação' });
            }
        });
    }
}
exports.default = new AvaliacaoController();
