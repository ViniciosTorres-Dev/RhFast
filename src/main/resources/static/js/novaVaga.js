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

$(document).ready(function(){
    checkLogin();
    $('#cep').mask('00000-000');
});

function checkLogin() {
    const recrutadorId = localStorage.getItem('recrutadorId');
    if (!recrutadorId) {
        alert("Você precisa estar logado para acessar esta página.");
        window.location.href = 'signInRecrutador.html';
    }
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

const formulario = document.querySelector('#novaVagaForm');
formulario.addEventListener('submit', (event) => {
  event.preventDefault();
  criarVaga();
});

function criarVaga() {
  const inputs = [nomeVagaInput, setorVagaInput, paisInput, estadoInput, cidadeInput, cepInput, nivelExperienciaInput, modalidadeInput, salarioInput, descricaoVagaInput];
  
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
    nomeVaga: nomeVagaInput.value,
    setorVaga: setorVagaInput.value,
    pais: paisInput.value,
    estado: estadoInput.value,
    cidade: cidadeInput.value,
    cep: cepInput.value.replace(/\D/g, ''),
    dataPostagem: new Date().toISOString().split('T')[0],
    status: 'ABERTA',
    nivelExperiencia: nivelExperienciaInput.value,
    modalidade: modalidadeInput.value,
    salario: parseFloat(salarioInput.value),
    descricaoVaga: descricaoVagaInput.value,
    recrutador: { id: parseInt(recrutadorId) }
  };

  fetch('http://localhost:8080/api/vagas', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosVaga)
    })
    .then(async resposta => {
      if (resposta.ok) {
        alert("Vaga criada com sucesso!");
        window.location.href = "mainRecrutador.html";
      } else {
        const erroObj = await resposta.json();
        alert(erroObj.mensagem || "Erro ao criar vaga.");
      }
    })
    .catch(erro => console.error("Erro na conexão:", erro));
}
