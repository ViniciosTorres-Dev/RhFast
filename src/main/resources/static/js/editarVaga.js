const nomeVagaInput = document.querySelector('#nomeVaga');
const setorVagaInput = document.querySelector('#setorVaga');
const paisInput = document.querySelector('#pais');
const estadoInput = document.querySelector('#estado');
const cidadeInput = document.querySelector('#cidade');
const cepInput = document.querySelector('#cep');
const nivelExperienciaInput = document.querySelector('#nivelExperiencia');
const modalidadeInput = document.querySelector('#modalidade');
const salarioInput = document.querySelector('#salario');
const descricaoVagaInput = document.querySelector('#descricaoVaga');
const statusInput = document.querySelector('#status');
const vagaIdInput = document.querySelector('#vagaId');

$(document).ready(function(){
    checkLogin();
    $('#cep').mask('00000-000');

    const urlParams = new URLSearchParams(window.location.search);
    const vagaId = urlParams.get('id');

    if (vagaId) {
        carregarVaga(vagaId);
    } else {
        alert("Vaga não especificada.");
        window.location.href = "mainRecrutador.html";
    }
});

function checkLogin() {
    const recrutadorId = localStorage.getItem('recrutadorId');
    if (!recrutadorId) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = 'signInRecrutador.html';
    }
}

function carregarVaga(id) {
    fetch(`http://localhost:8080/api/vagas/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar vaga');
            return response.json();
        })
        .then(vaga => {
            vagaIdInput.value = vaga.id;
            nomeVagaInput.value = vaga.nomeVaga;
            setorVagaInput.value = vaga.setorVaga;
            paisInput.value = vaga.pais;
            estadoInput.value = vaga.estado;
            cidadeInput.value = vaga.cidade;
            cepInput.value = vaga.cep;
            nivelExperienciaInput.value = vaga.nivelExperiencia;
            modalidadeInput.value = vaga.modalidade;
            salarioInput.value = vaga.salario;
            descricaoVagaInput.value = vaga.descricaoVaga;
            statusInput.value = vaga.status;
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao carregar dados da vaga.');
            window.location.href = "mainRecrutador.html";
        });
}

cepInput.addEventListener('blur', () => {
  let cep = cepInput.value.replace(/\D/g, '');

  if (cep.length === 8) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => response.json())
      .then(data => {
        if (!data.erro) {
            cidadeInput.value = data.localidade;
            estadoInput.value = data.uf;
        } else {
          alert("CEP não encontrado.");
        }
      })
      .catch(err => console.error("Erro ao buscar CEP", err));
  }
});

const formulario = document.querySelector('#editarVagaForm');
formulario.addEventListener('submit', (event) => {
  event.preventDefault();
  atualizarVaga();
});

function atualizarVaga() {
  const inputs = [nomeVagaInput, setorVagaInput, paisInput, estadoInput, cidadeInput, cepInput, nivelExperienciaInput, modalidadeInput, salarioInput, descricaoVagaInput, statusInput];

  for(let input of inputs) {
      if(!input.value.trim()) {
          alert(`O campo ${input.previousElementSibling.innerText} é obrigatório.`);
          return;
      }
  }

  const recrutadorId = localStorage.getItem('recrutadorId');
  if (!recrutadorId) {
      alert("Erro: Recrutador não identificado. Faça login novamente.");
      window.location.href = "signInRecrutador.html";
      return;
  }

  const dadosVaga = {
    id: vagaIdInput.value,
    nomeVaga: nomeVagaInput.value,
    setorVaga: setorVagaInput.value,
    pais: paisInput.value,
    estado: estadoInput.value,
    cidade: cidadeInput.value,
    cep: cepInput.value.replace(/\D/g, ''),
    status: statusInput.value,
    nivelExperiencia: nivelExperienciaInput.value,
    modalidade: modalidadeInput.value,
    salario: parseFloat(salarioInput.value),
    descricaoVaga: descricaoVagaInput.value,
    recrutador: { id: parseInt(recrutadorId) }
  };

  fetch(`http://localhost:8080/api/vagas/${vagaIdInput.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosVaga)
    })
    .then(async resposta => {
      if (resposta.ok) {
        alert("Vaga atualizada com sucesso!");
        window.location.href = "mainRecrutador.html";
      } else {
        const erroObj = await resposta.json();
        alert(erroObj.mensagem || "Erro ao atualizar vaga.");
      }
    })
    .catch(erro => console.error("Erro na conexão:", erro));
}
