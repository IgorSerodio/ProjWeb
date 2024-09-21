import { expect } from 'chai';
import axios from 'axios';
import { describe, it, beforeEach, afterEach } from 'mocha';
import dotenv from 'dotenv';

dotenv.config();

const baseUrl = `http://localhost:${process.env.PORT}`;

describe('UsuarioController Tests', () => {
  let stdUserId;
  let authToken;
  let admUserId;
  let admToken;

  beforeEach(async function () {
    const createAdmUser = await axios.post(`${baseUrl}/usuarios`, {
      email: 'test@adm.com',
      senha: 'Adm1234!',
      apelido: 'admuser',
      adm: true,
    });

    admUserId = createAdmUser.data.id;

    const loginAdmUser = await axios.post(`${baseUrl}/usuarios/login`, {
      email: 'test@adm.com',
      senha: 'Adm1234!',
    });

    admToken = loginAdmUser.data.token;

    const createStdUser = await axios.post(`${baseUrl}/usuarios`, {
      email: 'test@standard.com',
      senha: 'Standard1234!',
      apelido: 'standarduser',
      adm: false,
    });

    stdUserId = createStdUser.data.id;

    const loginStdUser = await axios.post(`${baseUrl}/usuarios/login`, {
      email: 'test@standard.com',
      senha: 'Standard1234!',
    });

    authToken = loginStdUser.data.token;
  });

  afterEach(async function () {
    try{
      await axios.delete(`${baseUrl}/usuarios/${stdUserId}`, {
        headers: {
          Authorization: `Bearer ${admToken}`,
        },
      });
    }catch(error){}

    await axios.delete(`${baseUrl}/usuarios/${admUserId}`, {
      headers: {
        Authorization: `Bearer ${admToken}`,
      },
    });
  });

  it('Deve criar um novo usuário com sucesso', async () => {
    const response = await axios.post(`${baseUrl}/usuarios`, {
      email: 'newuser@test.com',
      senha: 'NewUser123!',
      apelido: 'newuser',
      adm: false,
    });

    expect(response.status).to.equal(201);
    expect(response.data).to.have.property('email', 'newuser@test.com');

    await axios.delete(`${baseUrl}/usuarios/${response.data.id}`, {
      headers: {
        Authorization: `Bearer ${admToken}`,
      },
    });
  });

  it('Deve retornar erro 400 se faltarem atributos obrigatórios na criação de usuário (email ausente)', async () => {
    try {
      const response = await axios.post(`${baseUrl}/usuarios`, {
        senha: 'ValidPassword123!',
        apelido: 'newuser',
        adm: false,
      });
      expect.fail('Deveria ter retornado um erro');
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.have.property('error', 'Email, senha e apelido são obrigatórios');
    }
  });

  it('Deve retornar erro 400 se faltarem atributos obrigatórios na criação de usuário (senha ausente)', async () => {
    try {
      const response = await axios.post(`${baseUrl}/usuarios`, {
        email: 'newuser@test.com',
        apelido: 'newuser',
        adm: false,
      });
      expect.fail('Deveria ter retornado um erro');
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.have.property('error', 'Email, senha e apelido são obrigatórios');
    }
  });

  it('Deve retornar erro 400 se faltarem atributos obrigatórios na criação de usuário (apelido ausente)', async () => {
    try {
      const response = await axios.post(`${baseUrl}/usuarios`, {
        email: 'newuser@test.com',
        senha: 'ValidPassword123!',
        adm: false,
      });
      expect.fail('Deveria ter retornado um erro');
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.have.property('error', 'Email, senha e apelido são obrigatórios');
    }
  });

  it('Deve retornar erro 400 se faltarem atributos obrigatórios na atualização de usuário (senha ausente)', async () => {
    try {
      const response = await axios.put(`${baseUrl}/usuarios/${stdUserId}`, {
        apelido: 'updateduser',
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      expect.fail('Deveria ter retornado um erro');
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.have.property('error', 'Senha e apelido são obrigatórios');
    }
  });

  it('Deve retornar erro 400 se email estiver formatado inadequadamente', async () => {
    try {
      const response = await axios.post(`${baseUrl}/usuarios`, {
        email: 'invalidemail',
        senha: 'Valid123!',
        apelido: 'user',
        adm: false,
      });
      expect.fail('Deveria ter retornado um erro');
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.have.property('error', 'Formato de email inválido');
    }
  });

  it('Deve retornar erro 400 se a senha tiver menos de 8 caracteres', async () => {
    try {
      const response = await axios.post(`${baseUrl}/usuarios`, {
        email: 'valid@test.com',
        senha: 'Short',
        apelido: 'user',
        adm: false,
      });
      expect.fail('Deveria ter retornado um erro');
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.have.property('error', 'A senha deve ter pelo menos 8 caracteres');
    }
  });

  it('Deve retornar erro 400 se o apelido estiver em formato inadequado', async () => {
    try {
      const response = await axios.post(`${baseUrl}/usuarios`, {
        email: 'valid@test.com',
        senha: 'Valid123!',
        apelido: '1invalid',
        adm: false,
      });
      expect.fail('Deveria ter retornado um erro');
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.have.property('error', 'Apelido deve começar com uma letra e ter pelo menos 3 caracteres');
    }
  });

  it('Deve fazer login com sucesso com credenciais válidas', async () => {
    const response = await axios.post(`${baseUrl}/usuarios/login`, {
      email: 'test@standard.com',
      senha: 'Standard1234!',
    });

    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('token');
  });

  it('Deve retornar erro 401 com senha inválida', async () => {
    try {
      const response = await axios.post(`${baseUrl}/usuarios/login`, {
        email: 'test@standard.com',
        senha: 'WrongPassword',
      });
      expect.fail('Deveria ter retornado um erro');
    } catch (error) {
      expect(error.response.status).to.equal(401);
      expect(error.response.data).to.have.property('error', 'Senha inválida');
    }
  });

  it('Deve retornar erro 400 se faltarem atributos obrigatórios no login (email ausente)', async () => {
    try {
      const response = await axios.post(`${baseUrl}/usuarios/login`, {
        senha: 'ValidPassword123!',
      });
      expect.fail('Deveria ter retornado um erro');
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.have.property('error', 'Email e senha são obrigatórios');
    }
  });

  it('Deve retornar erro 400 se faltarem atributos obrigatórios no login (senha ausente)', async () => {
    try {
      const response = await axios.post(`${baseUrl}/usuarios/login`, {
        email: 'test@standard.com',
      });
      expect.fail('Deveria ter retornado um erro');
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.have.property('error', 'Email e senha são obrigatórios');
    }
  });

  it('Deve retornar erro 404 ao tentar login com usuário inexistente', async () => {
    try {
      const response = await axios.post(`${baseUrl}/usuarios/login`, {
        email: 'nonexistent@test.com',
        senha: 'SomePassword',
      });
      expect.fail('Deveria ter retornado um erro');
    } catch (error) {
      expect(error.response.status).to.equal(404);
      expect(error.response.data).to.have.property('error', 'Usuário não encontrado');
    }
  });

  it('Deve buscar um usuário por email com sucesso', async () => {
    const response = await axios.get(`${baseUrl}/usuarios/email/test@standard.com`);

    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('id', stdUserId);
    expect(response.data).to.have.property('email', 'test@standard.com');
  });

  it('Deve retornar erro 404 ao buscar um usuário por email inexistente', async () => {
    try {
      const response = await axios.get(`${baseUrl}/usuarios/email/nonexistent@test.com`);
      expect.fail('Deveria ter retornado um erro');
    } catch (error) {
      expect(error.response.status).to.equal(404);
      expect(error.response.data).to.have.property('error', 'Usuário não encontrado');
    }
  });

  it('Deve retornar erro 400 se o email estiver vazio', async () => {
    try {
      const response = await axios.get(`${baseUrl}/usuarios/email/`);
      expect.fail('Deveria ter retornado um erro');
    } catch (error) {
      expect(error.response.status).to.equal(400);
    }
  });

  it('Deve buscar um usuário existente por ID', async () => {
    const response = await axios.get(`${baseUrl}/usuarios/${stdUserId}`);

    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('id', stdUserId);
    expect(response.data).to.have.property('email', 'test@standard.com');
    expect(response.data).to.have.property('apelido', 'standarduser');
  });

  it('Deve retornar erro 404 ao buscar um usuário inexistente por ID', async () => {
    try {
      const response = await axios.get(`${baseUrl}/usuarios/99999`);
      expect.fail('Deveria ter retornado um erro');
    } catch (error) {
      expect(error.response.status).to.equal(404);
      expect(error.response.data).to.have.property('error', 'Usuário não encontrado');
    }
  });

  it('Deve retornar erro 400 se ID for inválido ao buscar usuário', async () => {
    try {
      const response = await axios.get(`${baseUrl}/usuarios/invalidId`);
      expect.fail('Deveria ter retornado um erro');
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.have.property('error', 'ID inválido');
    }
  });

  it('Deve atualizar o apelido do usuário autenticado', async () => {
    const response = await axios.put(`${baseUrl}/usuarios/${stdUserId}`, {
      apelido: 'updateduser',
      senha: 'Standard1234!',
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('apelido', 'updateduser');
  });

  it('Deve retornar erro 400 se faltarem atributos obrigatórios na atualização de usuário (senha ausente)', async () => {
    try {
      const response = await axios.put(`${baseUrl}/usuarios/${stdUserId}`, {
        apelido: 'updateduser',
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      expect.fail('Deveria ter retornado um erro');
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.have.property('error', 'Senha e apelido são obrigatórios');
    }
  });

  it('Deve retornar erro 400 se faltarem atributos obrigatórios na atualização de usuário (apelido ausente)', async () => {
    try {
      const response = await axios.put(`${baseUrl}/usuarios/${stdUserId}`, {
        senha: 'NewPassword123!',
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      expect.fail('Deveria ter retornado um erro');
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.have.property('error', 'Senha e apelido são obrigatórios');
    }
  });

  it('Deve retornar erro 403 ao tentar alterar um usuário diferente sem ser admin', async () => {
    try {
      const response = await axios.put(`${baseUrl}/usuarios/${admUserId}`, {
        apelido: 'notallowed',
        senha: 'Adm1234!',
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      expect.fail('Deveria ter retornado um erro');
    } catch (error) {
      expect(error.response.status).to.equal(403);
      expect(error.response.data).to.have.property('error', 'Acesso negado. Só é possível utilizar o id do usuário autenticado');
    }
  });

  it('Deve deletar o usuário autenticado com sucesso', async () => {
    const response = await axios.delete(`${baseUrl}/usuarios/${stdUserId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('message', 'Usuário deletado com sucesso');
  });

  it('Deve permitir que um admin delete outro usuário', async () => {
    const response = await axios.delete(`${baseUrl}/usuarios/${stdUserId}`, {
      headers: {
        Authorization: `Bearer ${admToken}`,
      },
    });

    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('message', 'Usuário deletado com sucesso');
  });
});
