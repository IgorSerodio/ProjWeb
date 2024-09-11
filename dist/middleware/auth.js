"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autenticarToken = autenticarToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET_KEY || '';
function autenticarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const tokenValido = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        req.usuario = tokenValido;
        next();
    }
    catch (err) {
        return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
}
