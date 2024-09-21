"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const auth_1 = require("./middleware/auth");
const UsuarioController_1 = __importDefault(require("./controllers/UsuarioController"));
const ReceitaController_1 = __importDefault(require("./controllers/ReceitaController"));
const IngredienteController_1 = __importDefault(require("./controllers/IngredienteController"));
const AvaliacaoController_1 = __importDefault(require("./controllers/AvaliacaoController"));
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
const port = config_1.default.serverPort;
app.use(express_1.default.json());
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Na Minha Geladeira',
            version: '1.0.0',
            description: 'API para gerenciar receitas, ingredientes e avaliações',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/**/*.ts'],
};
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
// Endpoint adicional para servir o JSON
app.get('/swagger.json', (req, res) => {
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
 *               senha:
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
app.post('/usuarios', UsuarioController_1.default.create);
/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     tags: [Usuarios]
 *     summary: Realiza login do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       500:
 *         description: Erro ao realizar login
 */
app.post('/usuarios/login', UsuarioController_1.default.login);
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
app.get('/usuarios/email/:email', UsuarioController_1.default.getByEmail);
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
app.get('/usuarios/:id', UsuarioController_1.default.getById);
/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     tags: [Usuarios]
 *     summary: Atualiza um usuário
 *     security:
 *       - bearerAuth: []
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
 *               senha:
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
app.put('/usuarios/:id', (0, auth_1.autenticarToken)(), UsuarioController_1.default.update);
/**
* @swagger
* /usuarios/{id}:
*   delete:
*     tags: [Usuarios]
*     summary: Deleta um usuário
*     security:
*       - bearerAuth: []
*     description: Remove um usuário.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         schema:
*           type: integer
*           example: 1
*         description: ID do usuário a ser deletado.
*     responses:
*       '204':
*         description: Usuário deletado com sucesso
*       '500':
*         description: Erro ao deletar usuário
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 error:
*                   type: string
*                   example: "Erro ao deletar usuário"
*/
app.delete('/usuarios/:id', (0, auth_1.autenticarToken)(), UsuarioController_1.default.delete);
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
 *     security:
 *       - bearerAuth: []
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
app.post('/receitas', (0, auth_1.autenticarToken)(), ReceitaController_1.default.create);
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
app.get('/receitas/usuario/:idDoUsuario', ReceitaController_1.default.getByUsuarioId);
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
app.get('/receitas/ingredientes', ReceitaController_1.default.getByIngredientes);
/**
 * @swagger
 * /receitas/{id}:
 *   put:
 *     tags: [Receitas]
 *     summary: Atualiza uma receita existente
 *     security:
 *       - bearerAuth: []
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
app.put('/receitas/:id', (0, auth_1.autenticarToken)(), ReceitaController_1.default.update);
/**
* @swagger
* /receitas/{id}:
*   delete:
*     tags: [Receitas]
*     summary: Deleta uma receita existente
*     security:
*       - bearerAuth: []
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
app.delete('/receitas/:id', (0, auth_1.autenticarToken)(), ReceitaController_1.default.delete);
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
app.get('/ingredientes', IngredienteController_1.default.getAll);
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
app.get('/ingredientes/:nome', IngredienteController_1.default.getByNome);
/**
 * @swagger
 * /ingredientes:
 *   post:
 *     tags: [Ingredientes]
 *     summary: Cria um novo ingrediente
 *     security:
 *       - bearerAuth: []
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
app.post('/ingredientes', (0, auth_1.autenticarToken)(true), IngredienteController_1.default.create);
/**
 * @swagger
 * /ingredientes/{nome}:
 *   delete:
 *     tags: [Ingredientes]
 *     summary: Deleta um ingrediente pelo nome
 *     security:
 *       - bearerAuth: []
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
app.delete('/ingredientes/:nome', (0, auth_1.autenticarToken)(true), IngredienteController_1.default.delete);
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
 *     security:
 *       - bearerAuth: []
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
app.post('/avaliacoes', (0, auth_1.autenticarToken)(), AvaliacaoController_1.default.create);
/**
 * @swagger
 * /avaliacoes/receitas/{idDaReceita}:
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
app.get('/avaliacoes/receita/:idDaReceita', AvaliacaoController_1.default.getByReceitaId);
/**
 * @swagger
 * /avaliacoes/{idDoUsuario}/{idDaReceita}:
 *   put:
 *     tags: [Avaliações]
 *     summary: Atualiza uma avaliação
 *     security:
 *       - bearerAuth: []
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
app.put('/avaliacoes/:idDoUsuario/:idDaReceita', (0, auth_1.autenticarToken)(), AvaliacaoController_1.default.update);
/**
 * @swagger
 * /avaliacoes/{idDoUsuario}/{idDaReceita}:
 *   delete:
 *     tags: [Avaliações]
 *     summary: Deleta uma avaliação
 *     security:
 *       - bearerAuth: []
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
app.delete('/avaliacoes/:idDoUsuario/:idDaReceita', (0, auth_1.autenticarToken)(), AvaliacaoController_1.default.delete);
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
