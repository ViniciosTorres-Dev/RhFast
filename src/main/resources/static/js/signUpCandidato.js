const nomeInput = document.querySelector('input[name="nome"]');
const sobrenomeInput = document.querySelector('input[name="sobrenome"]');
const cpfInput = document.querySelector('input[name="cpf"]');
const emailInput = document.querySelector('input[name="email"]');
const numeroTelefoneInput = document.querySelector('input[name="numeroTelefone"]');
const cepInput = document.querySelector('input[name="cep"]');
const cidadeInput = document.querySelector('input[name="cidade"]');
const estadoInput = document.querySelector('input[name="estado"]');
const ruaInput = document.querySelector('input[name="logradouro"]');
const situacaoInput = document.querySelector('select[name="situacao"]');
const dataNascimentoInput = document.querySelector('input[name="dataNascimento"]');
const senhaInput = document.querySelector('input[name="senha"]');
const confirmSenhaInput = document.querySelector('input[name="confirmSenha"]');

$('input[name="numeroTelefone"]').inputmask('(99) 99999-9999');
$('input[name="cpf"]').inputmask('999.999.999-99');
$('input[name="cep"]').inputmask('99999-999');

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

const formulario = document.querySelector('.login100-form');
formulario.addEventListener('submit', (event) => {
  event.preventDefault();

  cadastrarCandidato();
});

function cadastrarCandidato() {
  if (senhaInput.value !== confirmSenhaInput.value) {
    alert("As senhas não coincidem!");
    return;
  }
  if (nomeInput.value.trim() === "") {
    alert("Digite o seu nome");
    return;
  }
  if (sobrenomeInput.value.trim() === "") {
    alert("Digite o seu sobrenome");
    return;
  }
  if (cpfInput.value.trim() === "") {
    alert("Digite o seu cpf");
    return;
  }
  if (emailInput.value.trim() === "") {
    alert("Digite o seu e-mail");
    return;
  }
  if (numeroTelefoneInput.value.trim() === "") {
    alert("Digite o seu número de telefone");
    return;
  }
  if (cepInput.value.trim() === "") {
    alert("Digite o seu cep");
    return;
  }
  if (cidadeInput.value.trim() === "") {
    alert("Digite a sua cidade");
    return;
  }
  if (estadoInput.value.trim() === "") {
    alert("Digite o seu estado");
    return;
  }
  if (ruaInput.value.trim() === "") {
    alert("Digite o seu logradouro");
    return;
  }
  if (situacaoInput.value.trim() === "") {
    alert("Digite a sua situação");
    return;
  }
  if (dataNascimentoInput.value.trim() === "") {
    alert("Digite a sua data de nascimento");
    return;
  }
  if (senhaInput.value.trim() === "") {
    alert("Digite a sua senha");
    return;
  }
  if (confirmSenhaInput.value.trim() === "") {
    alert("Confirme a sua senha")
    return;
  }

  const dadosCandidato = {
    nome: nomeInput.value,
    sobrenome: sobrenomeInput.value,
    cpf: cpfInput.value,
    email: emailInput.value,
    numeroTelefone: numeroTelefoneInput.value,
    cep: cepInput.value,
    cidade: cidadeInput.value,
    estado: estadoInput.value,
    logradouro: ruaInput.value,
    situacao: situacaoInput.value,
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
        const erroObj = await resposta.json();
        alert(erroObj.mensagem)
      }
    })
    .catch(erro => console.error("Erro na conexão:", erro));
}