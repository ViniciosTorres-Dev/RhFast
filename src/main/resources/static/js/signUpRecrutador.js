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
    if ($.fn.inputmask) {
        $('input[name="numeroTelefone"]').inputmask('(99) 99999-9999');
        $('input[name="cpf"]').inputmask('999.999.999-99');
        $('input[name="cnpj"]').inputmask('99.999.999/9999-99');
        $('input[name="cep"]').inputmask('99999-999');
    } else if ($.fn.mask) {
        $('input[name="numeroTelefone"]').mask('(00) 00000-0000');
        $('input[name="cpf"]').mask('000.000.000-00');
        $('input[name="cnpj"]').mask('00.000.000/0000-00');
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

if(cnpjInput) {
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
            if(data.estabelecimento) {
                 if(data.estabelecimento.cep) {
                     cepInput.value = data.estabelecimento.cep;
                     cepInput.dispatchEvent(new Event('blur'));
                 }
            }
          })
          .catch(err => {
            console.error("Erro ao buscar CNPJ ou serviço indisponível", err);
          });
      }
    });
}

const formulario = document.querySelector('.login100-form');
if(formulario) {
    formulario.addEventListener('submit', (event) => {
      event.preventDefault();
      cadastrarRecrutador();
    });
}

function cadastrarRecrutador() {
  if (senhaInput.value !== confirmSenhaInput.value) {
    alert("As senhas não coincidem!");
    return;
  }

  const inputs = [nomeInput, sobrenomeInput, cpfInput, cargoInput, emailInput, numeroTelefoneInput, senhaInput, cnpjInput, empresaInput, cepInput, estadoInput, cidadeInput, ruaInput];
  for(let input of inputs) {
      if(input && !input.value.trim()) {
          alert(`Por favor, preencha todos os campos.`);
          return;
      }
  }

  // Estrutura ajustada para enviar objeto Empresa aninhado
  const dadosRecrutador = {
    nome: nomeInput.value,
    sobrenome: sobrenomeInput.value,
    cpf: cpfInput.value.replace(/\D/g, ''),
    cargo: cargoInput.value,
    email: emailInput.value,
    numeroTelefone: numeroTelefoneInput.value.replace(/\D/g, ''),
    senha: senhaInput.value,
    empresa: {
        nome: empresaInput.value,
        cnpj: cnpjInput.value.replace(/\D/g, ''),
        cep: cepInput.value.replace(/\D/g, ''),
        estado: estadoInput.value,
        cidade: cidadeInput.value,
        logradouro: ruaInput.value
    }
  };

  fetch('http://localhost:8080/api/recrutadores', {
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
        try {
            const erroObj = await resposta.json();
            // Tenta pegar mensagem de erro do backend, ou usa genérica
            let msg = erroObj.message || erroObj.mensagem || "Erro ao cadastrar recrutador.";
            // Se for erro de validação (lista de erros)
            if(erroObj.errors && Array.isArray(erroObj.errors)) {
                msg = erroObj.errors.map(e => e.defaultMessage).join("\n");
            }
            alert(msg);
        } catch(e) {
            alert("Erro ao cadastrar recrutador.");
        }
      }
    })
    .catch(erro => {
        console.error("Erro na conexão:", erro);
        alert("Erro de conexão com o servidor.");
    });
}
