import { expect } from 'chai';
import axios from 'axios';
import { describe, it, beforeEach, afterEach } from 'mocha';
import dotenv from 'dotenv';

dotenv.config();

const baseUrl = `http://localhost:${process.env.PORT}`;

describe('IngredienteController Tests', () => {
  let admUserId;
  let admToken;
  let stdUserId;
  let stdToken;
  let ingredienteNome = 'IngredientePadrão';

  beforeEach(async function () {
    const createAdmUser = await axios.post(`${baseUrl}/usuarios`, {
      email: 'adm@test.com',
      senha: 'Adm1234!',
      apelido: 'admuser',
      adm: true,
    });
    admUserId = createAdmUser.data.id;

    const loginAdmUser = await axios.post(`${baseUrl}/usuarios/login`, {
      email: 'adm@test.com',
      senha: 'Adm1234!',
    });
    admToken = loginAdmUser.data.token;

    const createStdUser = await axios.post(`${baseUrl}/usuarios`, {
      email: 'user@test.com',
      senha: 'User1234!',
      apelido: 'standarduser',
      adm: false,
    });
    stdUserId = createStdUser.data.id;

    const loginStdUser = await axios.post(`${baseUrl}/usuarios/login`, {
      email: 'user@test.com',
      senha: 'User1234!',
    });
    stdToken = loginStdUser.data.token;

    await axios.post(`${baseUrl}/ingredientes`, {
      nome: ingredienteNome,
      tipoDeMedida: 'UNIDADES', 
    }, {
      headers: { Authorization: `Bearer ${admToken}` },
    });
  });

  afterEach(async function () {

    try{
        await axios.delete(`${baseUrl}/ingredientes/${ingredienteNome}`, {
        headers: { Authorization: `Bearer ${admToken}` },
        });
    }catch(error){}

    await axios.delete(`${baseUrl}/usuarios/${stdUserId}`, {
      headers: { Authorization: `Bearer ${admToken}` },
    });
    await axios.delete(`${baseUrl}/usuarios/${admUserId}`, {
      headers: { Authorization: `Bearer ${admToken}` },
    });
  });

  it('Deve buscar todos os ingredientes com sucesso', async () => {
    const response = await axios.get(`${baseUrl}/ingredientes`);
    expect(response.status).to.equal(200);
    expect(response.data).to.be.an('array');
  });

  it('Deve buscar ingrediente pelo nome com sucesso', async () => {
    const response = await axios.get(`${baseUrl}/ingredientes/${ingredienteNome}`);
    expect(response.status).to.equal(200);
    expect(response.data).to.have.property('nome', ingredienteNome);
  });

  it('Deve retornar erro 404 ao buscar ingrediente pelo nome inexistente', async () => {
    try {
      await axios.get(`${baseUrl}/ingredientes/inexistente`);
    } catch (error) {
      expect(error.response.status).to.equal(404);
      expect(error.response.data).to.have.property('error', 'Ingrediente não encontrado');
    }
  });

  it('Deve criar um novo ingrediente com sucesso', async () => {
    const response = await axios.post(`${baseUrl}/ingredientes`, {
      nome: 'NovoIngrediente',
      tipoDeMedida: 'UNIDADES',
    }, {
      headers: { Authorization: `Bearer ${admToken}` },
    });

    expect(response.status).to.equal(201);
    expect(response.data).to.have.property('nome', 'NovoIngrediente');

    await axios.delete(`${baseUrl}/ingredientes/NovoIngrediente`, {
      headers: { Authorization: `Bearer ${admToken}` },
    });
  });

  it('Deve retornar erro 400 se faltarem atributos obrigatórios ao criar ingrediente', async () => {
    try {
      await axios.post(`${baseUrl}/ingredientes`, {
        tipoDeMedida: 'UNIDADES',
      }, {
        headers: { Authorization: `Bearer ${admToken}` },
      });
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.have.property('error', 'Nome do ingrediente é obrigatório e deve ser uma string não vazia');
    }
  });

  it('Deve retornar erro 400 ao tentar criar ingrediente com tipo de medida inválido', async () => {
    try {
      await axios.post(`${baseUrl}/ingredientes`, {
        nome: 'IngredienteComTipoInvalido',
        tipoDeMedida: 'medidaInvalida',
      }, {
        headers: { Authorization: `Bearer ${admToken}` },
      });
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data).to.have.property('error', 'Tipo de medida ausente ou inválido');
    }
  });

  it('Deve retornar erro 409 se o ingrediente já existir', async () => {
    try {
      await axios.post(`${baseUrl}/ingredientes`, {
        nome: ingredienteNome,
        tipoDeMedida: 'UNIDADES',
      }, {
        headers: { Authorization: `Bearer ${admToken}` },
      });
    } catch (error) {
      expect(error.response.status).to.equal(409);
      expect(error.response.data).to.have.property('error', 'Ingrediente com o mesmo nome já existe');
    }
  });

  it('Usuário não adm deve retornar erro 403 ao tentar criar um ingrediente', async () => {
    try {
      await axios.post(`${baseUrl}/ingredientes`, {
        nome: 'IngredienteNaoPermitido',
        tipoDeMedida: 'UNIDADES',
      }, {
        headers: { Authorization: `Bearer ${stdToken}` },
      });
    } catch (error) {
      expect(error.response.status).to.equal(403);
      expect(error.response.data).to.have.property('error', 'Acesso negado. Apenas administradores podem acessar.');
    }
  });

  it('Deve deletar ingrediente com sucesso', async () => {
    const response = await axios.delete(`${baseUrl}/ingredientes/${ingredienteNome}`, {
      headers: { Authorization: `Bearer ${admToken}` },
    });

    expect(response.status).to.equal(204);
  });

  it('Deve retornar erro 404 ao tentar deletar ingrediente inexistente', async () => {
    try {
      await axios.delete(`${baseUrl}/ingredientes/inexistente`, {
        headers: { Authorization: `Bearer ${admToken}` },
      });
    } catch (error) {
      expect(error.response.status).to.equal(404);
      expect(error.response.data).to.have.property('error', 'Ingrediente não encontrado');
    }
  });

  it('Usuário não adm deve retornar erro 403 ao tentar deletar um ingrediente', async () => {
    try {
      await axios.delete(`${baseUrl}/ingredientes/${ingredienteNome}`, {
        headers: { Authorization: `Bearer ${stdToken}` },
      });
    } catch (error) {
      expect(error.response.status).to.equal(403);
      expect(error.response.data).to.have.property('error', 'Acesso negado. Apenas administradores podem acessar.');
    }
  });
});
