const nomeInput = document.querySelector('input[name="nome"]');
const sobrenomeInput = document.querySelector('input[name="sobrenome"]');
const cpfInput = document.querySelector('input[name="cpf"]');
const emailInput = document.querySelector('input[name="email"]');
const numeroTelefoneInput = document.querySelector('input[name="numeroTelefone"]');
const cepInput = document.querySelector('input[name="cep"]');
const cidadeInput = document.querySelector('input[name="cidade"]');
const estadoInput = document.querySelector('input[name="estado"]');
const ruaInput = document.querySelector('input[name="logradouro"]');
const dataNascimentoInput = document.querySelector('input[name="dataNascimento"]');
const senhaInput = document.querySelector('input[name="senha"]');
const confirmSenhaInput = document.querySelector('input[name="confirmSenha"]');

$(document).ready(function(){
    if ($.fn.inputmask) {
        $('input[name="numeroTelefone"]').inputmask('(99) 99999-9999');
        $('input[name="cpf"]').inputmask('999.999.999-99');
        $('input[name="cep"]').inputmask('99999-999');
    } else if ($.fn.mask) {
        $('input[name="numeroTelefone"]').mask('(00) 00000-0000');
        $('input[name="cpf"]').mask('000.000.000-00');
        $('input[name="cep"]').mask('00000-000');
    }
});

if(cepInput) {
    cepInput.addEventListener('blur', () => {
      let cep = cepInput.value.replace(/\D/g, '');

      if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
          .then(response => response.json())
          .then(data => {
            if (!data.erro) {
              cidadeInput.value = data.localidade;
              estadoInput.value = data.uf;
              ruaInput.value = data.logradouro;
            } else {
              alert("CEP não encontrado.");
            }
          })
          .catch(err => console.error("Erro ao buscar CEP", err));
      }
    });
}

const formulario = document.querySelector('.login100-form');
if(formulario) {
    formulario.addEventListener('submit', (event) => {
      event.preventDefault();
      cadastrarCandidato();
    });
}

function cadastrarCandidato() {
  if (senhaInput.value !== confirmSenhaInput.value) {
    alert("As senhas não coincidem!");
    return;
  }

  const inputs = [nomeInput, sobrenomeInput, cpfInput, emailInput, numeroTelefoneInput, cepInput, cidadeInput, estadoInput, ruaInput, dataNascimentoInput, senhaInput, confirmSenhaInput];
  for(let input of inputs) {
      if(input && !input.value.trim()) {
          alert(`Por favor, preencha todos os campos.`);
          return;
      }
  }

  const dadosCandidato = {
    nome: nomeInput.value,
    sobrenome: sobrenomeInput.value,
    cpf: cpfInput.value.replace(/\D/g, ''),
    email: emailInput.value,
    numeroTelefone: numeroTelefoneInput.value.replace(/\D/g, ''),
    cep: cepInput.value.replace(/\D/g, ''),
    cidade: cidadeInput.value,
    estado: estadoInput.value,
    logradouro: ruaInput.value,
    dataNascimento: dataNascimentoInput.value,
    senha: senhaInput.value
  };

  fetch('http://localhost:8080/api/candidatos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosCandidato)
    })
    .then(async resposta => {
      if (resposta.ok) {
        alert("Candidato cadastrado com sucesso!");
        window.location.href = "signInCandidato.html";
      } else {
        try {
            const erroObj = await resposta.json();
            alert(erroObj.mensagem || "Erro ao cadastrar candidato.");
        } catch(e) {
            alert("Erro ao cadastrar candidato.");
        }
      }
    })
    .catch(erro => {
        console.error("Erro na conexão:", erro);
        alert("Erro de conexão com o servidor.");
    });
}