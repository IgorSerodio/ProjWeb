import { expect } from 'chai';
import axios from 'axios';
import { beforeEach, afterEach, describe, it } from 'mocha';

const baseUrl = 'http://localhost:3000';
let usuarioPadrao;
let usuarioAdm;
let ingrediente;
let receita;
let avaliacao;
let tokenUsuarioPadrao;
let tokenUsuarioAdm;

describe('Testes para as rotas de Avaliação', () => {
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

    const loginResponseUsuario = await axios.post(`${baseUrl}/usuarios/login`, {
        email: 'user@test.com',
        senha: '12345678'
      });
      tokenUsuarioPadrao = loginResponseUsuario.data.token;
  
      const loginResponseAdm = await axios.post(`${baseUrl}/usuarios/login`, {
        email: 'admin@test.com',
        senha: '12345678'
      });
      tokenUsuarioAdm = loginResponseAdm.data.token;

    ingrediente = await axios.post(`${baseUrl}/ingredientes`, {
      nome: 'Farinha',
      tipoDeMedida: 'GRAMAS'
    }, {
      headers: { Authorization: `Bearer ${tokenUsuarioAdm}` }
    });

    receita = await axios.post(`${baseUrl}/receitas`, {
      nome: 'Bolo Simples',
      descricao: 'Um bolo fácil de fazer',
      idDoUsuario: usuarioPadrao.id,
      ingredientes: [
        { nomeDoIngrediente: 'Farinha', quantidade: 200 }
      ]
    }, {
      headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` }
    });

    avaliacao = await axios.post(`${baseUrl}/avaliacoes`, {
      idDoUsuario: usuarioAdm.id,
      idDaReceita: receita.data.id,
      nota: 5,
      comentario: 'Delicioso!'
    }, {
      headers: { Authorization: `Bearer ${tokenUsuarioAdm}` }
    });

  });

  afterEach(async () => {
    try{
        await axios.delete(`${baseUrl}/avaliacoes/${usuarioAdm.id}/${receita.data.id}`, {
            headers: { Authorization: `Bearer ${tokenUsuarioAdm}` }
        });
    } catch (error){}
    await axios.delete(`${baseUrl}/receitas/${receita.data.id}`, {
      headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` }
    });
    await axios.delete(`${baseUrl}/ingredientes/${ingrediente.data.nome}`, {
      headers: { Authorization: `Bearer ${tokenUsuarioAdm}` }
    });
    await axios.delete(`${baseUrl}/usuarios/${usuarioPadrao.id}`, {
        headers: { Authorization: `Bearer ${tokenUsuarioAdm}` }
    });
    await axios.delete(`${baseUrl}/usuarios/${usuarioAdm.id}`, {
        headers: { Authorization: `Bearer ${tokenUsuarioAdm}` }
    });
  });

  it('Deve criar uma avaliação com sucesso', async () => {
    const response = await axios.post(`${baseUrl}/avaliacoes`, {
      idDoUsuario: usuarioPadrao.id,
      idDaReceita: receita.data.id,
      nota: 5,
      comentario: 'Delicioso!'
    }, {
      headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` }
    });
    
    expect(response.status).to.equal(201);

    await axios.delete(`${baseUrl}/avaliacoes/${usuarioPadrao.id}/${receita.data.id}`, {
        headers: { Authorization: `Bearer ${tokenUsuarioAdm}` }
    });
  });

  it('Deve retornar erro 400 se idDoUsuario ou idDaReceita não forem números', async () => {
    try {
      await axios.post(`${baseUrl}/avaliacoes`, {
        idDoUsuario: 'abc',
        idDaReceita: 'xyz',
        nota: 5
      }, {
        headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` }
      });
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data.error).to.equal('idDoUsuario e idDaReceita devem ser números');
    }
  });

  it('Deve retornar erro 400 se a nota não estiver entre 1 e 5', async () => {
    try {
      await axios.post(`${baseUrl}/avaliacoes`, {
        idDoUsuario: usuarioPadrao.id,
        idDaReceita: receita.data.id,
        nota: 6
      }, {
        headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` }
      });
    } catch (error) {
      expect(error.response.status).to.equal(400);
      expect(error.response.data.error).to.equal('A nota deve ser um número entre 1 e 5');
    }
  });

  it('Deve retornar erro 409 se o usuário tentar avaliar a mesma receita novamente', async () => {
    await axios.post(`${baseUrl}/avaliacoes`, {
      idDoUsuario: usuarioPadrao.id,
      idDaReceita: receita.data.id,
      nota: 5,
      comentario: 'Delicioso!'
    }, {
      headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` }
    });

    try {
      await axios.post(`${baseUrl}/avaliacoes`, {
        idDoUsuario: usuarioPadrao.id,
        idDaReceita: receita.data.id,
        nota: 4,
        comentario: 'Gostei!'
      }, {
        headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` }
      });
    } catch (error) {
      expect(error.response.status).to.equal(409);
      expect(error.response.data.error).to.equal('Um usuário só pode deixar uma avaliação por receita');
    }
    await axios.delete(`${baseUrl}/avaliacoes/${usuarioPadrao.id}/${receita.data.id}`, {
        headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` }
    });
  });

  it('Deve retornar as avaliações de uma receita', async () => {
    const response = await axios.get(`${baseUrl}/avaliacoes/receita/${receita.data.id}`);
    expect(response.status).to.equal(200);
    expect(response.data.length).to.equal(1);
  });

  it('Deve atualizar uma avaliação com sucesso', async () => {
    
    const updatedAvaliacao = await axios.put(`${baseUrl}/avaliacoes/${usuarioAdm.id}/${receita.data.id}`, {
      nota: 4,
      comentario: 'Agora é melhor!'
    }, {
      headers: { Authorization: `Bearer ${tokenUsuarioAdm}` }
    });

    expect(updatedAvaliacao.status).to.equal(200);
    expect(updatedAvaliacao.data).to.have.property('nota', 4);
  });

  it('Deve retornar erro 404 ao tentar atualizar uma avaliação inexistente', async () => {
    try {
      await axios.put(`${baseUrl}/avaliacoes/${usuarioPadrao.id}/99999`, {
        nota: 4,
        comentario: "wow!"
      }, {
        headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` }
      });
    } catch (error) {
      expect(error.response.status).to.equal(404);
      expect(error.response.data.error).to.equal('Avaliação não encontrada para o usuário e receita especificados');
    }
  });

  it('Deve deletar uma avaliação com sucesso', async () => {
    const response = await axios.post(`${baseUrl}/avaliacoes`, {
      idDoUsuario: usuarioPadrao.id,
      idDaReceita: receita.data.id,
      nota: 5,
      comentario: 'Delicioso!'
    }, {
      headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` }
    });

    const deleteResponse = await axios.delete(`${baseUrl}/avaliacoes/${usuarioPadrao.id}/${receita.data.id}`, {
      headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` }
    });
    expect(deleteResponse.status).to.equal(200);
  });

  it('Deve retornar erro 404 ao tentar deletar uma avaliação inexistente', async () => {
    try {
      await axios.delete(`${baseUrl}/avaliacoes/${usuarioPadrao.id}/99999`, {
        headers: { Authorization: `Bearer ${tokenUsuarioPadrao}` }
      });
    } catch (error) {
      expect(error.response.status).to.equal(404);
      expect(error.response.data.error).to.equal('Avaliação não encontrada para o usuário e receita especificados');
    }
  });

  it('Deve retornar erro 403 se um usuário tentar deletar uma avaliação que não é dele', async () => {
    try {
      await axios.delete(`${baseUrl}/avaliacoes/${usuarioAdm.id}/${receita.data.id}`, {
        headers: { Authorization: `Bearer ${tokenUsuarioAdm}` }
      });
    } catch (error) {
      expect(error.response.status).to.equal(403);
      expect(error.response.data.error).to.equal('Acesso negado. Só é possível utilizar o id do usuário autenticado');
    }
  });
});
