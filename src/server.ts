import express, { Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import UsuarioController from './controllers/UsuarioController';
import ReceitaController from './controllers/ReceitaController';
import IngredienteController from './controllers/IngredienteController';
import AvaliacaoController from './controllers/AvaliacaoController';

const app = express();
const port = 3000;

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

/**
 * @swagger
 * /usuarios:
 *   post:
 *     tags: [Usuarios]
 *     summary: Cria um novo usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               hashSenha:
 *                 type: string
 *               apelido:
 *                 type: string
 *               adm:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
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
 *         description: Erro ao criar usuário
 */

app.post('/usuarios', UsuarioController.create);

app.post('/usuarios/login', UsuarioController.login);
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
app.get('/usuarios/email/:email', UsuarioController.getByEmail);
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
app.get('/usuarios/:id', UsuarioController.getById);
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
app.put('/usuarios/:id', UsuarioController.update);

/**
 * @swagger
 * tags:
 *   name: Receitas
 *   description: Gerencia receitas.
 */

/**
 * @swagger
 * /receitas:
 *   post:
 *     tags: [Receitas]
 *     summary: Cria uma nova receita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *               idDoUsuario:
 *                 type: integer
 *               ingredientes:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         nomeDoIngrediente:
 *                           type: string
 *                         quantidade:
 *                           type: number
 *     responses:
 *       201:
 *         description: Receita criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 nome:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 idDoUsuario:
 *                   type: integer
 *                 ingredientesReceita:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         idDaReceita:
 *                           type: integer
 *                         nomeDoIngrediente:
 *                           type: string
 *                         quantidade:
 *                           type: number
 *       500:
 *         description: Erro ao criar receita
 */
app.post('/receitas', ReceitaController.create);
/**
 * @swagger
 * /receitas/usuario/{idDoUsuario}:
 *   get:
 *     tags: [Receitas]
 *     summary: Busca receitas por ID do usuário
 *     parameters:
 *       - name: idDoUsuario
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de receitas do usuário
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
 *                   ingredientesReceita:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         idDaReceita:
 *                           type: integer
 *                         nomeDoIngrediente:
 *                           type: string
 *                         quantidade:
 *                           type: number
 *       500:
 *         description: Erro ao buscar receitas do usuário
 */
app.get('/receitas/usuario/:idDoUsuario', ReceitaController.getByUsuarioId);
/**
 * @swagger
 * /receitas/ingredientes:
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
 *                   ingredientesReceita:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         idDaReceita:
 *                           type: integer
 *                         nomeDoIngrediente:
 *                           type: string
 *                         quantidade:
 *                           type: number
 *       500:
 *         description: Erro ao buscar receitas por ingredientes
 */
app.get('/receitas/ingredientes', ReceitaController.getByIngredientes);
/**
 * @swagger
 * /receitas/{id}:
 *   put:
 *     tags: [Receitas]
 *     summary: Atualiza uma receita existente
 *     description: Atualiza os detalhes de uma receita e seus ingredientes.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: ID da receita a ser atualizada.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: "Receita Atualizada"
 *               descricao:
 *                 type: string
 *                 example: "Descrição da receita atualizada."
 *               ingredientesReceita:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         nomeDoIngrediente:
 *                           type: string
 *                         quantidade:
 *                           type: number
 *     responses:
 *       '200':
 *         description: Receita atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: "Receita Atualizada"
 *                 descricao:
 *                   type: string
 *                   example: "Descrição da receita atualizada."
 *                 ingredientes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                         idDaReceita:
 *                           type: integer
 *                         nomeDoIngrediente:
 *                           type: string
 *                         quantidade:
 *                           type: number
 *       '500':
 *         description: Erro ao atualizar receita
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao atualizar receita"
 */
app.put('/receitas/:id', ReceitaController.update);
/**
* @swagger
* /receitas/{id}:
*   delete:
*     tags: [Receitas]
*     summary: Deleta uma receita existente
*     description: Remove uma receita e seus ingredientes associados.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*           example: 1
*         description: ID da receita a ser deletada.
*     responses:
*       '204':
*         description: Receita deletada com sucesso
*       '500':
*         description: Erro ao deletar receita
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: "Erro ao deletar receita"
*/
app.delete('/receitas/:id', ReceitaController.delete);

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
app.get('/ingredientes', IngredienteController.getAll);
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
app.get('/ingredientes/:nome', IngredienteController.getByNome);
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
app.post('/ingredientes', IngredienteController.create);
/**
 * @swagger
 * /ingredientes/{nome}:
 *   delete:
 *     tags: [Ingredientes]
 *     summary: Deleta um ingrediente pelo nome
 *     parameters:
 *       - name: nome
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Ingrediente deletado com sucesso
 *       500:
 *         description: Erro ao deletar ingrediente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erro ao deletar ingrediente"
 */
app.delete('/ingredientes/:nome', IngredienteController.delete);

/**
 * @swagger
 * tags:
 *   name: Avaliações
 *   description: Gerencia avaliações.
 */

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
app.post('/avaliacoes', AvaliacaoController.create);
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
app.get('/receitas/avaliacoes/:idDaReceita', AvaliacaoController.getByReceitaId);
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
app.put('/avaliacoes/:idDoUsuario/:idDaReceita', AvaliacaoController.update);
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
app.delete('/avaliacoes/:idDoUsuario/:idDaReceita', AvaliacaoController.delete);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

