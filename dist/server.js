"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("@prisma/client"));

const app = (0, express_1.default)();
const port = 3000;
const prisma = new prisma_1.default.PrismaClient();

app.use(express_1.default.json());

// Rotas para o modelo Receita
app.post('/receitas', async (req, res) => {
    try {
        const { nome, descricao, idDoUsuario, ingredientes } = req.body;
        const receita = await prisma.receita.create({
            data: { nome, descricao, idDoUsuario }
        });

        const ingredientesReceita = ingredientes.map(ingrediente => ({
            idDaReceita: receita.id,
            nomeDoIngrediente: ingrediente[0], 
            quantidade: ingrediente[1],
        }));

        await prisma.ingredienteReceita.createMany({
            data: ingredientesReceita
        });

        res.status(201).json({ ...receita, ingredientesReceita });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar receita' });
    }
});

app.get('/receitas/usuario/:idDoUsuario', async (req, res) => {
    try {
        const { idDoUsuario } = req.params;
        const receitas = await prisma.receita.findMany({
            where: { idDoUsuario: parseInt(idDoUsuario) },
            include: {
                IngredienteReceita: {
                    include: { ingrediente: true }
                }
            }
        });
        res.json(receitas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar receitas por usuário' });
    }
});

app.put('/receitas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, descricao, ingredientes } = req.body;

        await prisma.ingredienteReceita.deleteMany({
            where: { idDaReceita: parseInt(id) },
        });

        const receita = await prisma.receita.update({
            where: { id: parseInt(id) },
            data: { nome, descricao }
        });

        const ingredientesReceita = ingredientes.map(ingrediente => ({
            idDaReceita: receita.id,
            nomeDoIngrediente: ingrediente[0],
            quantidade: ingrediente[1],
        }));

        await prisma.ingredienteReceita.createMany({
            data: ingredientesReceita
        });

        res.json({ ...receita, ingredientesReceita });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar receita' });
    }
});

app.delete('/receitas/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.ingredienteReceita.deleteMany({
            where: { idDaReceita: parseInt(id) },
        });

        await prisma.receita.delete({
            where: { id: parseInt(id) },
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar receita' });
    }
});

// Rotas para o modelo Usuario
app.post('/usuarios', async (req, res) => {
    try {
        const { email, hashSenha, apelido, adm } = req.body;
        const usuario = await prisma.usuario.create({
            data: { email, hashSenha, apelido, adm },
        });
        res.status(201).json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
});

// Buscar usuário por email
app.get('/usuarios/email/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const usuario = await prisma.usuario.findUnique({
            where: { email: email },
        });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário por email' });
    }
});

app.get('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await prisma.usuario.findUnique({
            where: { id: parseInt(id) },
        });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
});

app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { hashSenha, apelido } = req.body;
        const usuario = await prisma.usuario.update({
            where: { id: parseInt(id) },
            data: { hashSenha, apelido },
        });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
});

// Buscar receitas com base em uma lista de ingredientes
app.get('/receitas-por-ingredientes', async (req, res) => {
    try {
        const { ingredientes } = req.query;
        const ingredientesList = ingredientes.split(',').map(nome => nome.trim());
        const receitas = await prisma.receita.findMany({
            where: {
                IngredienteReceita: {
                    some: {
                        nomeDoIngrediente: {
                            in: ingredientesList,
                        },
                    },
                },
            },
            include: {
                IngredienteReceita: {
                    include: { ingrediente: true }
                }
            }
        });
        res.json(receitas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar receitas por ingredientes' });
    }
});

// Rotas para o modelo Ingrediente
app.get('/ingredientes', async (req, res) => {
    try {
        const ingredientes = await prisma.ingrediente.findMany();
        res.json(ingredientes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar ingredientes' });
    }
});

app.get('/ingredientes/nome/:nome', async (req, res) => {
    try {
        const { nome } = req.params;
        const ingrediente = await prisma.ingrediente.findUnique({
            where: { nome: nome },
        });
        res.json(ingrediente);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar ingrediente pelo nome' });
    }
});

app.post('/ingredientes', async (req, res) => {
    try {
        const { nome, tipoDeMedida } = req.body;
        const ingrediente = await prisma.ingrediente.create({
            data: { nome, tipoDeMedida },
        });
        res.status(201).json(ingrediente);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar ingrediente' });
    }
});

// Rotas para Avaliação
app.get('/avaliacoes/:idDaReceita', async (req, res) => {
    try {
        const { idDaReceita } = req.params;
        const avaliacoes = await prisma.avaliacao.findMany({
            where: { idDaReceita: parseInt(idDaReceita) },
        });
        res.json(avaliacoes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar avaliações' });
    }
});

app.post('/avaliacoes', async (req, res) => {
    try {
        const { idDoUsuario, idDaReceita, nota, comentario } = req.body;
        const avaliacao = await prisma.avaliacao.create({
            data: { idDoUsuario, idDaReceita, nota, comentario },
        });
        res.status(201).json(avaliacao);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar avaliação' });
    }
});

app.put('/avaliacoes/:idDoUsuario/:idDaReceita', async (req, res) => {
    try {
        const { idDoUsuario, idDaReceita } = req.params;
        const { nota, comentario } = req.body;
        const avaliacao = await prisma.avaliacao.update({
            where: { idDoUsuario_idDaReceita: { idDoUsuario: parseInt(idDoUsuario), idDaReceita: parseInt(idDaReceita) } },
            data: { nota, comentario },
        });
        res.json(avaliacao);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar avaliação' });
    }
});

app.delete('/avaliacoes/:idDoUsuario/:idDaReceita', async (req, res) => {
    try {
        const { idDoUsuario, idDaReceita } = req.params;
        await prisma.avaliacao.delete({
            where: { idDoUsuario_idDaReceita: { idDoUsuario: parseInt(idDoUsuario), idDaReceita: parseInt(idDaReceita) } },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar avaliação' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
