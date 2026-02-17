const nomeInput = document.querySelector('input[name="nome"]');
const sobrenomeInput = document.querySelector('input[name="sobrenome"]');
const cpfInput = document.querySelector('input[name="cpf"]');
const cargoInput = document.querySelector('input[name="cargo"]');
const emailInput = document.querySelector('input[name="email"]');
const numeroTelefoneInput = document.querySelector('input[name="numeroTelefone"]');
const senhaInput = document.querySelector('input[name="senha"]');
const confirmSenhaInput = document.querySelector('input[name="confirmSenha"]');

const cnpjInput = document.querySelector('input[name="cnpj"]');
const empresaInput = document.querySelector('input[name="empresa"]');
const cepInput = document.querySelector('input[name="cep"]');
const estadoInput = document.querySelector('input[name="estado"]');
const cidadeInput = document.querySelector('input[name="cidade"]');
const ruaInput = document.querySelector('input[name="logradouro"]');

$(document).ready(function(){
    $('input[name="numeroTelefone"]').inputmask('(99) 99999-9999');
    $('input[name="cpf"]').inputmask('999.999.999-99');
    $('input[name="cnpj"]').inputmask('99.999.999/9999-99');
    $('input[name="cep"]').inputmask('99999-999');
});

cepInput.addEventListener('blur', () => {
  let cep = cepInput.value.replace(/\D/g, '');

  if (cep.length === 8) {
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => response.json())
      .then(data => {
        if (!data.erro) {
            cidadeInput.value = data.localidade;
            estadoInput.value = data.estado;
            ruaInput.value = data.logradouro;
        } else {
          alert("CEP não encontrado.");
        }
      })
      .catch(err => console.error("Erro ao buscar CEP", err));
  }
});

cnpjInput.addEventListener('blur', () => {
  let cnpj = cnpjInput.value.replace(/\D/g, '');

  if (cnpj.length === 14) {
    
    fetch(`https://publica.cnpj.ws/cnpj/${cnpj}`)
      .then(response => {
        if(response.ok) return response.json();
        throw new Error('Erro na requisição');
      })
      .then(data => {
        empresaInput.value = data.razao_social || data.nome_fantasia;

            $(cepInput).trigger('input');
      })
      .catch(err => {
        console.error("Erro ao buscar CNPJ", err);
      });
  }
});

const formulario = document.querySelector('.login100-form');
formulario.addEventListener('submit', (event) => {
  event.preventDefault();
  cadastrarRecrutador();
});

function cadastrarRecrutador() {
  if (senhaInput.value !== confirmSenhaInput.value) {
    alert("As senhas não coincidem!");
    return;
  }

  const inputs = [nomeInput, sobrenomeInput, cpfInput, cargoInput, emailInput, numeroTelefoneInput, senhaInput, cnpjInput, empresaInput, cepInput, estadoInput, cidadeInput, ruaInput];
  for(let input of inputs) {
      if(!input.value.trim()) {
          alert(`O campo ${input.name} é obrigatório.`);
          return;
      }
  }

  const dadosRecrutador = {
    nome: nomeInput.value,
    sobrenome: sobrenomeInput.value,
    cpf: cpfInput.value,
    cargo: cargoInput.value,
    email: emailInput.value,
    numeroTelefone: numeroTelefoneInput.value,
    senha: senhaInput.value,
    cnpj: cnpjInput.value,
    empresa: empresaInput.value,
    cep: cepInput.value,
    estado: estadoInput.value,
    cidade: cidadeInput.value,
    logradouro: ruaInput.value
  };

  fetch('http://localhost:8080/api/recrutadores', { // Ajuste a URL conforme seu backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosRecrutador)
    })
    .then(async resposta => {
      if (resposta.ok) {
        alert("Recrutador cadastrado com sucesso!");
        window.location.href = "signInRecrutador.html";
      } else {
        const erroObj = await resposta.json();
        alert(erroObj.mensagem || "Erro ao cadastrar recrutador.");
      }
    })
    .catch(erro => console.error("Erro na conexão:", erro));
}