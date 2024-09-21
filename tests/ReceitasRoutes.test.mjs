import { expect } from 'chai';
import axios from 'axios';
import { beforeEach, afterEach, describe, it } from 'mocha';

const baseUrl = 'http://localhost:3000'; // Defina a URL base do servidor
let usuarioPadrao;
let usuarioAdm;
let receitaPadrao;
let receitaAdicional;
let ingredientes;
let tokenUsuarioPadrao;
let tokenAdm;

describe('Testes para as rotas de Receita', () => {

  beforeEach(async () => {
    const userResponse = await axios.post(`${baseUrl}/usuarios`, {
      apelido: 'UserTest',
      email: 'user@test.com',
      senha: '12345678',
      adm: false
    });
    usuarioPadrao = userResponse.data;

    const admResponse = await axios.post(`${baseUrl}/usuarios`, {
      apelido: 'AdminTest',
      email: 'admin@test.com',
      senha: '12345678',
      adm: true
    });
    usuarioAdm = admResponse.data;

    const loginUserResponse = await axios.post(`${baseUrl}/usuarios/login`, {
      email: 'user@test.com',
      senha: '12345678'
    });
    tokenUsuarioPadrao = loginUserResponse.data.token;

    const loginAdmResponse = await axios.post(`${baseUrl}/usuarios/login`, {
      email: 'admin@test.com',
      senha: '12345678'
    });
    tokenAdm = loginAdmResponse.data.token;

    const ingrediente1 = await axios.post(`${baseUrl}/ingredientes`, { nome: 'Farinha', tipoDeMedida: 'GRAMAS' }, { headers: { Authorization: `Bearer ${tokenAdm}` }});
    const ingrediente2 = await axios.post(`${baseUrl}/ingredientes`, { nome: 'Ovo', tipoDeMedida: 'UNIDADES' }, { headers: { Authorization: `Bearer ${tokenAdm}` }});
    const ingrediente3 = await axios.post(`${baseUrl}/ingredientes`, { nome: 'Açúcar', tipoDeMedida: 'GRAMAS' }, { headers: { Authorization: `Bearer ${tokenAdm}` }});
    ingredientes = [ingrediente1.data, ingrediente2.data, ingrediente3.data];

    const receita1 = await axios.post(`${baseUrl}/receitas`, {
      nome: 'Bolo Simples',
      descricao: 'Um bolo fácil de fazer',
      idDoUsuario: usuarioPadrao.id,
      ingredientes: [
        { nomeDoIngrediente: 'Farinha', quantidade: 200 },
        { nomeDoIngrediente: 'Ovo', quantidade: 2 }
      ]
    }, { headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` } });
    receitaPadrao = receita1.data;

    const receita2 = await axios.post(`${baseUrl}/receitas`, {
      nome: 'Bolo de Açúcar',
      descricao: 'Bolo com farinha e açúcar',
      idDoUsuario: usuarioAdm.id,
      ingredientes: [
        { nomeDoIngrediente: 'Farinha', quantidade: 200 },
        { nomeDoIngrediente: 'Açúcar', quantidade: 100 }
      ]
    }, { headers: { Authorization: `Bearer ${tokenAdm}` } });
    receitaAdicional = receita2.data;
  });

  afterEach(async () => {
    try{
        await axios.delete(`${baseUrl}/receitas/${receitaPadrao.id}`, { headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` } });
    } catch (error) {}
    await axios.delete(`${baseUrl}/receitas/${receitaAdicional.id}`, { headers: { Authorization: `Bearer ${tokenAdm}` } });
    for (const ingrediente of ingredientes) {
      await axios.delete(`${baseUrl}/ingredientes/${ingrediente.nome}`, { headers: { Authorization: `Bearer ${tokenAdm}` } });
    }
    await axios.delete(`${baseUrl}/usuarios/${usuarioPadrao.id}`, { headers: { Authorization: `Bearer ${tokenAdm}` } });
    await axios.delete(`${baseUrl}/usuarios/${usuarioAdm.id}`, { headers: { Authorization: `Bearer ${tokenAdm}` } });
  });

  it('Deve retornar receitas com todos os ingredientes da lista fornecida (coincidência total)', async () => {
    const response = await axios.get(`${baseUrl}/receitas/ingredientes`, {
      params: { ingredientes: 'Farinha, Ovo' }
    });
    expect(response.status).to.equal(200);
    expect(response.data.length).to.equal(1);
    expect(response.data[0].nome).to.equal('Bolo Simples');
  });

  it('Deve retornar receitas com todos os ingredientes contidos na lista, mas com menos ingredientes que a lista', async () => {
    const response = await axios.get(`${baseUrl}/receitas/ingredientes`, {
      params: { ingredientes: 'Farinha, Ovo, Açúcar' }
    });
    expect(response.status).to.equal(200);
    expect(response.data.length).to.equal(2);
    const nomesReceitas = response.data.map((r) => r.nome);
    expect(nomesReceitas).to.include('Bolo Simples');
    expect(nomesReceitas).to.include('Bolo de Açúcar');
  });

  it('Deve não retornar receitas que contenham 1 ingrediente fora da lista fornecida', async () => {
    try {
      await axios.get(`${baseUrl}/receitas/ingredientes`, {
        params: { ingredientes: 'Farinha' }
      });
    } catch (error) {
      expect(error.response.status).to.equal(404);
      expect(error.response.data.error).to.equal('Nenhuma receita encontrada com esses ingredientes');
    }
  });

  it('Deve retornar erro 400 se os ingredientes não forem uma string', async () => {
    try {
      await axios.get(`${baseUrl}/receitas/ingredientes`, {
        params: { ingredientes: ['Farinha', 'Ovo'] }
      });
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data.error).to.equal('Ingredientes são obrigatórios e devem ser uma string');
    }
  });

  it('Deve retornar erro 400 se não for passado ingredientes', async () => {
    try {
      await axios.get(`${baseUrl}/receitas/ingredientes`, {
        params: { ingredientes: '' }
      });
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data.error).to.equal('Ingredientes são obrigatórios e devem ser uma string');
    }
  });

  it('Deve criar uma receita com sucesso', async () => {
    const novaReceita = {
      nome: 'Bolo de Chocolate',
      descricao: 'Delicioso bolo de chocolate',
      idDoUsuario: usuarioPadrao.id,
      ingredientes: [
        { nomeDoIngrediente: 'Farinha', quantidade: 300 },
        { nomeDoIngrediente: 'Ovo', quantidade: 3 },
      ],
    };
    const response = await axios.post(`${baseUrl}/receitas`, novaReceita, {
      headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` }
    });
    expect(response.status).to.equal(201);
    expect(response.data.nome).to.equal('Bolo de Chocolate');

    await axios.delete(`${baseUrl}/receitas/${response.data.id}`, { headers: { Authorization: `Bearer ${tokenAdm}` } });
  });

  it('Deve retornar erro 400 se faltar campos obrigatórios ao criar receita', async () => {
    try {
      await axios.post(`${baseUrl}/receitas`, {
        descricao: 'Receita incompleta',
        idDoUsuario: usuarioPadrao.id,
      }, { headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` } });
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data.error).to.equal('Nome, descrição, idDoUsuario e ingredientes são obrigatórios');
    }
  });

  it('Deve retornar erro 400 se o nome da receita estiver vazio', async () => {
    try {
      await axios.post(`${baseUrl}/receitas`, {
        nome: '', 
        descricao: 'Receita válida',
        idDoUsuario: usuarioPadrao.id,
        ingredientes: [{ nomeDoIngrediente: 'Farinha', quantidade: 200 }]
      }, { headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` } });
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data.error).to.equal('Nome da receita tem que ser uma string e não pode ser vazio');
    }
  });
  
  it('Deve retornar erro 400 se o idDoUsuario não for um número', async () => {
    try {
      await axios.post(`${baseUrl}/receitas`, {
        nome: 'Bolo Válido',
        descricao: 'Receita válida',
        idDoUsuario: 'abc',
        ingredientes: [{ nomeDoIngrediente: 'Farinha', quantidade: 200 }]
      }, { headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` } });
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data.error).to.equal('ID do usuário inválido');
    }
  });
  
  it('Deve retornar erro 400 se os ingredientes não forem um array', async () => {
    try {
      await axios.post(`${baseUrl}/receitas`, {
        nome: 'Bolo Válido',
        descricao: 'Receita válida',
        idDoUsuario: usuarioPadrao.id,
        ingredientes: 'Farinha, Ovo'
      }, { headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` } });
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data.error).to.equal('Ingredientes devem ser um array de objetos com { nomeDoIngrediente: string, quantidade: number }');
    }
  });

  it('Deve retornar as receitas de um usuário específico', async () => {
    const response = await axios.get(`${baseUrl}/receitas/usuario/${usuarioPadrao.id}`);
    expect(response.status).to.equal(200);
    expect(response.data.length).to.equal(1);
    expect(response.data[0].nome).to.equal('Bolo Simples');
  });

  it('Deve retornar erro 404 se o usuário não tiver receitas', async () => {
    const novoUsuario = await axios.post(`${baseUrl}/usuarios`, {
      apelido: 'UsuarioSemReceitas',
      email: 'semreceitas@test.com',
      senha: '12345678',
      adm: false
    });

    try {
      await axios.get(`${baseUrl}/receitas/usuario/${novoUsuario.data.id}`);
    } catch (error) {
      expect(error.response.status).to.equal(404);
      expect(error.response.data.error).to.equal('Nenhuma receita encontrada para o usuário');
    }

    await axios.delete(`${baseUrl}/usuarios/${novoUsuario.data.id}`, {
        headers: { Authorization: `Bearer ${tokenAdm}` }
    });
  });

  it('Deve atualizar uma receita com sucesso (usuário autenticado)', async () => {
    const atualizacao = {
      nome: 'Bolo Atualizado',
      descricao: 'Descrição atualizada',
      ingredientes: [
        { nomeDoIngrediente: 'Farinha', quantidade: 250 },
        { nomeDoIngrediente: 'Ovo', quantidade: 3 }
      ]
    };

    const response = await axios.put(`${baseUrl}/receitas/${receitaPadrao.id}`, atualizacao, {
      headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` }
    });
    expect(response.status).to.equal(200);
    expect(response.data.nome).to.equal('Bolo Atualizado');
  });

  it('Deve retornar erro 403 ao tentar atualizar uma receita que pertence a outro usuário', async () => {
    try {
      await axios.put(`${baseUrl}/receitas/${receitaAdicional.id}`, {
        nome: 'Tentativa de Atualização',
        descricao: 'Descrição atualizada',
        ingredientes: [
            { nomeDoIngrediente: 'Farinha', quantidade: 250 },
            { nomeDoIngrediente: 'Ovo', quantidade: 3 }
        ]
      }, {
        headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` }
      });
    } catch (error) {
      expect(error.response.status).to.equal(403);
      expect(error.response.data.error).to.equal('Acesso negado. Só é possível utilizar o id do usuário autenticado');
    }
  });

  it('Deve permitir que o admin atualize uma receita de outro usuário', async () => {
    const atualizacao = {
      nome: 'Atualizado pelo Admin',
      descricao: 'Admin pode atualizar qualquer receita',
      ingredientes: [
          { nomeDoIngrediente: 'Farinha', quantidade: 250 },
          { nomeDoIngrediente: 'Ovo', quantidade: 3 }
      ]
    };

    const response = await axios.put(`${baseUrl}/receitas/${receitaPadrao.id}`, atualizacao, {
      headers: { Authorization: `Bearer ${tokenAdm}` }
    });
    expect(response.status).to.equal(200);
    expect(response.data.nome).to.equal('Atualizado pelo Admin');
  });

  it('Deve deletar uma receita com sucesso', async () => {
    const response = await axios.delete(`${baseUrl}/receitas/${receitaPadrao.id}`, {
      headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` }
    });
    expect(response.status).to.equal(200);
    expect(response.data.message).to.equal('Receita deletada com sucesso');
  });

  it('Deve retornar erro 403 ao tentar deletar uma receita que não é do usuário', async () => {
    try {
      await axios.delete(`${baseUrl}/receitas/${receitaAdicional.id}`, {
        headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` }
      });
    } catch (error) {
      expect(error.response.status).to.equal(403);
      expect(error.response.data.error).to.equal('Acesso negado. Só é possível utilizar o id do usuário autenticado');
    }
  });

  it('Deve permitir que o admin delete uma receita de outro usuário', async () => {
    const response = await axios.delete(`${baseUrl}/receitas/${receitaPadrao.id}`, {
      headers: { Authorization: `Bearer ${tokenAdm}` }
    });
    expect(response.status).to.equal(200);
    expect(response.data.message).to.equal('Receita deletada com sucesso');
  });
});
