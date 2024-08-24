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
            try {
                const avaliacao = yield AvaliacaoService_1.default.create({ idDoUsuario, idDaReceita, nota, comentario });
                res.status(201).json(avaliacao);
            }
            catch (error) {
                res.status(400).json({ error: 'Erro ao criar avaliação' });
            }
        });
    }
    getByReceitaId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idDaReceita } = req.params;
            try {
                const avaliacoes = yield AvaliacaoService_1.default.findByReceitaId(Number(idDaReceita));
                res.status(200).json(avaliacoes);
            }
            catch (error) {
                res.status(400).json({ error: 'Erro ao buscar avaliações' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idDoUsuario, idDaReceita } = req.params;
            const { nota, comentario } = req.body;
            try {
                const avaliacao = yield AvaliacaoService_1.default.update(Number(idDoUsuario), Number(idDaReceita), { nota, comentario });
                if (avaliacao.count === 0) {
                    return res.status(404).json({ error: 'Avaliação não encontrada para o usuário e receita especificados' });
                }
                res.status(200).json({ message: 'Avaliação atualizada com sucesso' });
            }
            catch (error) {
                res.status(400).json({ error: 'Erro ao atualizar avaliação' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idDoUsuario, idDaReceita } = req.params;
            try {
                const deleteCount = yield AvaliacaoService_1.default.delete(Number(idDoUsuario), Number(idDaReceita));
                if (deleteCount.count === 0) {
                    return res.status(404).json({ error: 'Avaliação não encontrada para o usuário e receita especificados' });
                }
                res.status(204).send();
            }
            catch (error) {
                res.status(400).json({ error: 'Erro ao deletar avaliação' });
            }
        });
    }
}
exports.default = new AvaliacaoController();
