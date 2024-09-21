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
const chai_1 = require("chai");
const axios_1 = __importDefault(require("axios"));
const mocha_1 = require("mocha");
const config_1 = __importDefault(require("../src/config"));
const node_test_1 = require("node:test");
const baseUrl = `http://localhost:${config_1.default.serverPort}`;
(0, mocha_1.describe)('UsuarioController Tests', () => {
    let stdUserId;
    let authToken;
    let admUserId;
    let admToken;
    (0, node_test_1.before)(function () {
        return __awaiter(this, void 0, void 0, function* () {
            const createAdmUser = yield axios_1.default.post(`${baseUrl}/usuarios`, {
                email: 'test@adm.com',
                senha: 'Adm1234!',
                apelido: 'admuser',
                adm: true,
            });
            admUserId = createAdmUser.data.id;
            const loginAdmUser = yield axios_1.default.post(`${baseUrl}/usuarios/login`, {
                email: 'test@adm.com',
                senha: 'Adm1234!',
            });
            admToken = loginAdmUser.data.token;
        });
    });
    (0, mocha_1.beforeEach)(function () {
        return __awaiter(this, void 0, void 0, function* () {
            const createStdUser = yield axios_1.default.post(`${baseUrl}/usuarios`, {
                email: 'test@standard.com',
                senha: 'Standard1234!',
                apelido: 'standarduser',
                adm: false,
            });
            stdUserId = createStdUser.data.id;
            const loginStdUser = yield axios_1.default.post(`${baseUrl}/usuarios/login`, {
                email: 'test@standard.com',
                senha: 'Standard1234!',
            });
            authToken = loginStdUser.data.token;
        });
    });
    (0, mocha_1.afterEach)(function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield axios_1.default.delete(`${baseUrl}/usuarios/${stdUserId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
        });
    });
    (0, mocha_1.it)('Deve criar um novo usuário com sucesso', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.post(`${baseUrl}/usuarios`, {
            email: 'newuser@test.com',
            senha: 'NewUser123!',
            apelido: 'newuser',
            adm: false,
        });
        (0, chai_1.expect)(response.status).to.equal(201);
        (0, chai_1.expect)(response.data).to.have.property('email', 'newuser@test.com');
        yield axios_1.default.delete(`${baseUrl}/usuarios/${response.data.id}`, {
            headers: {
                Authorization: `Bearer ${admToken}`,
            },
        });
    }));
    (0, mocha_1.it)('Deve retornar erro 400 se faltarem atributos obrigatórios na criação de usuário (email ausente)', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.post(`${baseUrl}/usuarios`, {
            senha: 'ValidPassword123!',
            apelido: 'newuser',
            adm: false,
        });
        (0, chai_1.expect)(response.status).to.equal(400);
        (0, chai_1.expect)(response.data).to.have.property('error', 'Email, senha e apelido são obrigatórios');
    }));
    (0, mocha_1.it)('Deve retornar erro 400 se faltarem atributos obrigatórios na criação de usuário (senha ausente)', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.post(`${baseUrl}/usuarios`, {
            email: 'newuser@test.com',
            apelido: 'newuser',
            adm: false,
        });
        (0, chai_1.expect)(response.status).to.equal(400);
        (0, chai_1.expect)(response.data).to.have.property('error', 'Email, senha e apelido são obrigatórios');
    }));
    (0, mocha_1.it)('Deve retornar erro 400 se faltarem atributos obrigatórios na criação de usuário (apelido ausente)', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.post(`${baseUrl}/usuarios`, {
            email: 'newuser@test.com',
            senha: 'ValidPassword123!',
            adm: false,
        });
        (0, chai_1.expect)(response.status).to.equal(400);
        (0, chai_1.expect)(response.data).to.have.property('error', 'Email, senha e apelido são obrigatórios');
    }));
    (0, mocha_1.it)('Deve retornar erro 400 se faltarem atributos obrigatórios na atualização de usuário (senha ausente)', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.put(`${baseUrl}/usuarios/${stdUserId}`, {
            apelido: 'updateduser',
        }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        (0, chai_1.expect)(response.status).to.equal(400);
        (0, chai_1.expect)(response.data).to.have.property('error', 'Senha e apelido são obrigatórios');
    }));
    (0, mocha_1.it)('Deve retornar erro 400 se email estiver formatado inadequadamente', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.post(`${baseUrl}/usuarios`, {
            email: 'invalidemail',
            senha: 'Valid123!',
            apelido: 'user',
            adm: false,
        });
        (0, chai_1.expect)(response.status).to.equal(400);
        (0, chai_1.expect)(response.data).to.have.property('error', 'Formato de email inválido');
    }));
    (0, mocha_1.it)('Deve retornar erro 400 se a senha tiver menos de 8 caracteres', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.post(`${baseUrl}/usuarios`, {
            email: 'valid@test.com',
            senha: 'Short',
            apelido: 'user',
            adm: false,
        });
        (0, chai_1.expect)(response.status).to.equal(400);
        (0, chai_1.expect)(response.data).to.have.property('error', 'A senha deve ter pelo menos 8 caracteres');
    }));
    (0, mocha_1.it)('Deve retornar erro 400 se o apelido estiver em formato inadequado', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.post(`${baseUrl}/usuarios`, {
            email: 'valid@test.com',
            senha: 'Valid123!',
            apelido: '1invalid',
            adm: false,
        });
        (0, chai_1.expect)(response.status).to.equal(400);
        (0, chai_1.expect)(response.data).to.have.property('error', 'Apelido deve começar com uma letra e ter pelo menos 3 caracteres');
    }));
    (0, mocha_1.it)('Deve fazer login com sucesso com credenciais válidas', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.post(`${baseUrl}/usuarios/login`, {
            email: 'test@standard.com',
            senha: 'Standard1234!',
        });
        (0, chai_1.expect)(response.status).to.equal(200);
        (0, chai_1.expect)(response.data).to.have.property('token');
    }));
    (0, mocha_1.it)('Deve retornar erro 401 com senha inválida', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.post(`${baseUrl}/usuarios/login`, {
            email: 'test@standard.com',
            senha: 'WrongPassword',
        });
        (0, chai_1.expect)(response.status).to.equal(401);
        (0, chai_1.expect)(response.data).to.have.property('error', 'Senha inválida');
    }));
    (0, mocha_1.it)('Deve retornar erro 400 se faltarem atributos obrigatórios no login (email ausente)', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.post(`${baseUrl}/usuarios/login`, {
            senha: 'ValidPassword123!',
        });
        (0, chai_1.expect)(response.status).to.equal(400);
        (0, chai_1.expect)(response.data).to.have.property('error', 'Email e senha são obrigatórios');
    }));
    (0, mocha_1.it)('Deve retornar erro 400 se faltarem atributos obrigatórios no login (senha ausente)', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.post(`${baseUrl}/usuarios/login`, {
            email: 'test@standard.com',
        });
        (0, chai_1.expect)(response.status).to.equal(400);
        (0, chai_1.expect)(response.data).to.have.property('error', 'Email e senha são obrigatórios');
    }));
    (0, mocha_1.it)('Deve retornar erro 404 ao tentar login com usuário inexistente', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.post(`${baseUrl}/usuarios/login`, {
            email: 'nonexistent@test.com',
            senha: 'SomePassword',
        });
        (0, chai_1.expect)(response.status).to.equal(404);
        (0, chai_1.expect)(response.data).to.have.property('error', 'Usuário não encontrado');
    }));
    (0, mocha_1.it)('Deve buscar um usuário existente por ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.get(`${baseUrl}/usuarios/${stdUserId}`);
        (0, chai_1.expect)(response.status).to.equal(200);
        (0, chai_1.expect)(response.data).to.have.property('id', stdUserId);
        (0, chai_1.expect)(response.data).to.have.property('email', 'test@standard.com');
        (0, chai_1.expect)(response.data).to.have.property('apelido', 'standarduser');
    }));
    (0, mocha_1.it)('Deve retornar erro 404 ao buscar um usuário inexistente por ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.get(`${baseUrl}/usuarios/99999`);
        (0, chai_1.expect)(response.status).to.equal(404);
        (0, chai_1.expect)(response.data).to.have.property('error', 'Usuário não encontrado');
    }));
    (0, mocha_1.it)('Deve retornar erro 400 se ID for inválido ao buscar usuário', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.get(`${baseUrl}/usuarios/invalidId`);
        (0, chai_1.expect)(response.status).to.equal(400);
        (0, chai_1.expect)(response.data).to.have.property('error', 'ID inválido');
    }));
    (0, mocha_1.it)('Deve atualizar o apelido do usuário autenticado', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.put(`${baseUrl}/usuarios/${stdUserId}`, {
            apelido: 'updateduser',
            senha: 'Standard1234!',
        }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        (0, chai_1.expect)(response.status).to.equal(200);
        (0, chai_1.expect)(response.data).to.have.property('apelido', 'updateduser');
    }));
    (0, mocha_1.it)('Deve retornar erro 400 se faltarem atributos obrigatórios na atualização de usuário (senha ausente)', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.put(`${baseUrl}/usuarios/${stdUserId}`, {
            apelido: 'updateduser',
        }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        (0, chai_1.expect)(response.status).to.equal(400);
        (0, chai_1.expect)(response.data).to.have.property('error', 'Senha e apelido são obrigatórios');
    }));
    (0, mocha_1.it)('Deve retornar erro 400 se faltarem atributos obrigatórios na atualização de usuário (apelido ausente)', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.put(`${baseUrl}/usuarios/${stdUserId}`, {
            senha: 'NewPassword123!',
        }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        (0, chai_1.expect)(response.status).to.equal(400);
        (0, chai_1.expect)(response.data).to.have.property('error', 'Senha e apelido são obrigatórios');
    }));
    (0, mocha_1.it)('Deve retornar erro 403 ao tentar alterar um usuário diferente sem ser admin', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.put(`${baseUrl}/usuarios/${admUserId}`, {
            apelido: 'notallowed',
            senha: 'Adm1234!',
        }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        (0, chai_1.expect)(response.status).to.equal(403);
        (0, chai_1.expect)(response.data).to.have.property('error', 'Acesso negado. Só é possível utilizar o id do usuário autenticado');
    }));
    (0, mocha_1.it)('Deve deletar o usuário autenticado com sucesso', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.delete(`${baseUrl}/usuarios/${stdUserId}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        (0, chai_1.expect)(response.status).to.equal(200);
        (0, chai_1.expect)(response.data).to.have.property('message', 'Usuário deletado com sucesso');
    }));
    (0, mocha_1.it)('Deve permitir que um admin delete outro usuário', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield axios_1.default.delete(`${baseUrl}/usuarios/${stdUserId}`, {
            headers: {
                Authorization: `Bearer ${admToken}`,
            },
        });
        (0, chai_1.expect)(response.status).to.equal(200);
        (0, chai_1.expect)(response.data).to.have.property('message', 'Usuário deletado com sucesso');
    }));
});
