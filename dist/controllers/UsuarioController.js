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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UsuarioService_1 = __importDefault(require("../services/UsuarioService"));
const config_1 = __importDefault(require("../config"));
const jwtSecretKey = config_1.default.jwtSecretKey;
class UsuarioController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, senha } = req.body;
            if (!email || !senha) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }
            try {
                const usuario = yield UsuarioService_1.default.getByEmail(email);
                if (!usuario) {
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                }
                const senhaCorreta = yield bcrypt_1.default.compare(senha, usuario.hashSenha);
                if (!senhaCorreta) {
                    return res.status(401).json({ error: 'Senha inválida' });
                }
                const token = jsonwebtoken_1.default.sign({ id: usuario.id, adm: usuario.adm }, jwtSecretKey, { expiresIn: '1h' });
                return res.status(200).json({ token });
            }
            catch (error) {
                return res.status(500).json({ error: 'Erro ao realizar login' });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, senha, apelido, adm } = req.body;
            if (!email || !senha || !apelido) {
                return res.status(400).json({ error: 'Email, senha e apelido são obrigatórios' });
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ error: 'Formato de email inválido' });
            }
            const apelidoRegex = /^[A-Za-z_][A-Za-z0-9_]{2,}$/;
            if (!apelidoRegex.test(apelido)) {
                return res.status(400).json({ error: 'Apelido deve começar com uma letra e ter pelo menos 3 caracteres' });
            }
            if (senha.length < 8) {
                return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres' });
            }
            try {
                const usuarioExistente = yield UsuarioService_1.default.getByEmail(email);
                if (usuarioExistente) {
                    return res.status(409).json({ error: 'Já existe um usuário com este e-mail' });
                }
                const hashSenha = yield bcrypt_1.default.hash(senha, 10);
                const usuario = yield UsuarioService_1.default.create({ email, hashSenha, apelido, adm });
                return res.status(201).json(usuario);
            }
            catch (error) {
                return res.status(500).json({ error: 'Erro ao criar usuário' });
            }
        });
    }
    getByEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.params;
            if (!email) {
                return res.status(400).json({ error: 'Email é obrigatório' });
            }
            try {
                const usuario = yield UsuarioService_1.default.getByEmail(email);
                if (!usuario) {
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                }
                return res.status(200).json(usuario);
            }
            catch (error) {
                return res.status(500).json({ error: 'Erro ao buscar usuário por email' });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            try {
                const usuario = yield UsuarioService_1.default.getById(parseInt(id));
                if (!usuario) {
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                }
                return res.status(200).json(usuario);
            }
            catch (error) {
                return res.status(500).json({ error: 'Erro ao buscar usuário' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            if (req.usuario != undefined) {
                if (req.usuario.id != id && req.usuario.adm != true) {
                    return res.status(403).json({ error: 'Acesso negado. Só é possível utilizar o id do usuário autenticado' });
                }
            }
            const { senha, apelido } = req.body;
            if (!senha || !apelido) {
                return res.status(400).json({ error: 'Senha e apelido são obrigatórios' });
            }
            const apelidoRegex = /^[A-Za-z_][A-Za-z0-9_]{2,}$/;
            if (!apelidoRegex.test(apelido)) {
                return res.status(400).json({ error: 'Apelido deve começar com uma letra e ter pelo menos 3 caracteres' });
            }
            if (senha.length < 8) {
                return res.status(400).json({ error: 'A senha deve ter pelo menos 8 caracteres' });
            }
            try {
                const hashSenha = yield bcrypt_1.default.hash(senha, 10);
                const usuario = yield UsuarioService_1.default.update(parseInt(id), { hashSenha, apelido });
                return res.status(200).json(usuario);
            }
            catch (error) {
                return res.status(500).json({ error: 'Erro ao atualizar usuário' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id || isNaN(Number(id))) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            if (req.usuario !== undefined) {
                if (req.usuario.id != id && !req.usuario.adm) {
                    return res.status(403).json({ error: 'Acesso negado. Você só pode deletar sua própria conta ou ser administrador' });
                }
            }
            try {
                const usuario = yield UsuarioService_1.default.getById(parseInt(id));
                if (!usuario) {
                    return res.status(404).json({ error: 'Usuário não encontrado' });
                }
                const result = yield UsuarioService_1.default.delete(parseInt(id));
                return res.status(200).json({
                    message: "Usuário deletado com sucesso"
                });
            }
            catch (error) {
                return res.status(500).json({ error: 'Erro ao deletar usuário' });
            }
        });
    }
}
exports.default = new UsuarioController();
