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
const UsuarioService_1 = __importDefault(require("../services/UsuarioService"));
class UsuarioController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, hashSenha, apelido, adm } = req.body;
                const usuario = yield UsuarioService_1.default.create({ email, hashSenha, apelido, adm });
                res.status(201).json(usuario);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao criar usuário' });
            }
        });
    }
    getByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.params;
                const usuario = yield UsuarioService_1.default.getByEmail(email);
                res.json(usuario);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao buscar usuário por email' });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const usuario = yield UsuarioService_1.default.getById(parseInt(id));
                res.json(usuario);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao buscar usuário' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { hashSenha, apelido } = req.body;
                const usuario = yield UsuarioService_1.default.update(parseInt(id), { hashSenha, apelido });
                res.json(usuario);
            }
            catch (error) {
                res.status(500).json({ error: 'Erro ao atualizar usuário' });
            }
        });
    }
}
exports.default = new UsuarioController();
