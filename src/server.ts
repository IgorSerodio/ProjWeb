import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
const port = 3000;
const prisma = new PrismaClient();

app.use(express.json());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Na Minha Geladeira',
      version: '1.0.0',
      description: 'API para gerenciar receitas, ingredientes e avaliações',
    },
  },
  apis: ['./src/**/*.ts'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Endpoint adicional para servir o JSON
app.get('/swagger.json', (req: Request, res: Response) => {
  res.json(swaggerDocs);
});

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gerencia usuários.
 */

app.post('/usuarios', async (req: Request, res: Response) => {
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

/**
 * @swagger
 * /usuarios/email/{email}:
 *   get:
 *     tags: [Usuarios]
 *     summary: Busca um usuário por email
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 hashSenha:
 *                   type: string
 *                 apelido:
 *                   type: string
 *                 adm:
 *                   type: boolean
 *       500:
 *         description: Erro ao buscar usuário por email
 */
app.get('/usuarios/email/:email', async (req: Request, res: Response) => {
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

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     tags: [Usuarios]
 *     summary: Busca um usuário por ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 hashSenha:
 *                   type: string
 *                 apelido:
 *                   type: string
 *                 adm:
 *                   type: boolean
 *       500:
 *         description: Erro ao buscar usuário
 */
app.get('/usuarios/:id', async (req: Request, res: Response) => {
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

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     tags: [Usuarios]
 *     summary: Atualiza um usuário
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hashSenha:
 *                 type: string
 *               apelido:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 hashSenha:
 *                   type: string
 *                 apelido:
 *                   type: string
 *                 adm:
 *                   type: boolean
 *       500:
 *         description: Erro ao atualizar usuário
 */
app.put('/usuarios/:id', async (req: Request, res: Response) => {
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

/**
 * @swagger
 * /receitas-por-ingredientes:
 *   get:
 *     tags: [Receitas]
 *     summary: Busca receitas com base em uma lista de ingredientes
 *     parameters:
 *       - name: ingredientes
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de receitas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nome:
 *                     type: string
 *                   descricao:
 *                     type: string
 *                   idDoUsuario:
 *                     type: integer
 *                   IngredienteReceita:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         nomeDoIngrediente:
 *                           type: string
 *                         quantidade:
 *                           type: number
 *       500:
 *         description: Erro ao buscar receitas por ingredientes
 */
app.get('/receitas-por-ingredientes', async (req: Request, res: Response) => {
  try {
    const { ingredientes } = req.query;
    const ingredientesList = (ingredientes as string).split(',').map(nome => nome.trim());
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

/**
 * @swagger
 * tags:
 *   name: Ingredientes
 *   description: Gerencia ingredientes.
 */

/**
 * @swagger
 * /ingredientes:
 *   get:
 *     tags: [Ingredientes]
 *     summary: Busca todos os ingredientes
 *     responses:
 *       200:
 *         description: Lista de ingredientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nome:
 *                     type: string
 *                   tipoDeMedida:
 *                     type: string
 *                     enum: [UNIDADES, GRAMAS, MILILITROS]
 *       500:
 *         description: Erro ao buscar ingredientes
 */
app.get('/ingredientes', async (req: Request, res: Response) => {
  try {
    const ingredientes = await prisma.ingrediente.findMany();
    res.json(ingredientes);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ingredientes' });
  }
});

/**
 * @swagger
 * /ingredientes/nome/{nome}:
 *   get:
 *     tags: [Ingredientes]
 *     summary: Busca um ingrediente pelo nome
 *     parameters:
 *       - name: nome
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ingrediente encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nome:
 *                   type: string
 *                 tipoDeMedida:
 *                   type: string
 *                   enum: [UNIDADES, GRAMAS, MILILITROS]
 *       500:
 *         description: Erro ao buscar ingrediente pelo nome
 */
app.get('/ingredientes/nome/:nome', async (req: Request, res: Response) => {
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

/**
 * @swagger
 * /ingredientes:
 *   post:
 *     tags: [Ingredientes]
 *     summary: Cria um novo ingrediente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               tipoDeMedida:
 *                 type: string
 *                 enum: [UNIDADES, GRAMAS, MILILITROS]
 *     responses:
 *       201:
 *         description: Ingrediente criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nome:
 *                   type: string
 *                 tipoDeMedida:
 *                   type: string
 *                   enum: [UNIDADES, GRAMAS, MILILITROS]
 *       500:
 *         description: Erro ao criar ingrediente
 */
app.post('/ingredientes', async (req: Request, res: Response) => {
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

/**
 * @swagger
 * tags:
 *   name: Avaliações
 *   description: Gerencia avaliações.
 */

/**
 * @swagger
 * /avaliacoes/{idDaReceita}:
 *   get:
 *     tags: [Avaliações]
 *     summary: Busca avaliações por ID da receita
 *     parameters:
 *       - name: idDaReceita
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de avaliações
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   idDoUsuario:
 *                     type: integer
 *                   idDaReceita:
 *                     type: integer
 *                   nota:
 *                     type: number
 *                   comentario:
 *                     type: string
 *       500:
 *         description: Erro ao buscar avaliações
 */
app.get('/avaliacoes/:idDaReceita', async (req: Request, res: Response) => {
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

/**
 * @swagger
 * /avaliacoes:
 *   post:
 *     tags: [Avaliações]
 *     summary: Cria uma nova avaliação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idDoUsuario:
 *                 type: integer
 *               idDaReceita:
 *                 type: integer
 *               nota:
 *                 type: number
 *               comentario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Avaliação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idDoUsuario:
 *                   type: integer
 *                 idDaReceita:
 *                   type: integer
 *                 nota:
 *                   type: number
 *                 comentario:
 *                   type: string
 *       500:
 *         description: Erro ao criar avaliação
 */
app.post('/avaliacoes', async (req: Request, res: Response) => {
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

/**
 * @swagger
 * /avaliacoes/{idDoUsuario}/{idDaReceita}:
 *   put:
 *     tags: [Avaliações]
 *     summary: Atualiza uma avaliação
 *     parameters:
 *       - name: idDoUsuario
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: idDaReceita
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nota:
 *                 type: number
 *               comentario:
 *                 type: string
 *     responses:
 *       200:
 *         description: Avaliação atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idDoUsuario:
 *                   type: integer
 *                 idDaReceita:
 *                   type: integer
 *                 nota:
 *                   type: number
 *                 comentario:
 *                   type: string
 *       500:
 *         description: Erro ao atualizar avaliação
 */
app.put('/avaliacoes/:idDoUsuario/:idDaReceita', async (req: Request, res: Response) => {
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

/**
 * @swagger
 * /avaliacoes/{idDoUsuario}/{idDaReceita}:
 *   delete:
 *     tags: [Avaliações]
 *     summary: Deleta uma avaliação
 *     parameters:
 *       - name: idDoUsuario
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: idDaReceita
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Avaliação deletada com sucesso
 *       500:
 *         description: Erro ao deletar avaliação
 */
app.delete('/avaliacoes/:idDoUsuario/:idDaReceita', async (req: Request, res: Response) => {
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

