"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello, world!');
});
app.get('/receitas', (req, res) => {
    res.send('receitas com o que tem em casa');
});
app.post('/nova_receita', (req, res) => {
    res.send('receita adicionada');
});
app.post('/login', (req, res) => {
    res.send('bem vindo novamente');
});
app.post('/singin', (req, res) => {
    res.send('bem vindo');
});
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
