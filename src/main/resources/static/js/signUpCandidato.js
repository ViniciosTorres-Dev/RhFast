const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', function() {
    // Apply input masks
    $('#numeroTelefone').mask('(00) 00000-0000');
    $('#cpf').mask('000.000.000-00');
    $('#cep').mask('00000-000');

    // CEP lookup
    const cepInput = document.getElementById('cep');
    cepInput.addEventListener('blur', () => {
        const cep = cepInput.value.replace(/\D/g, '');
        if (cep.length === 8) {
            buscarEnderecoPorCep(cep);
        }
    });

    // Form submission
    const form = document.getElementById('formSignupCandidato');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        cadastrarCandidato();
    });
});

function buscarEnderecoPorCep(cep) {
    const statusMessage = document.getElementById('signupMessage');
    statusMessage.textContent = 'Buscando CEP...';

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na rede: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            statusMessage.textContent = ''; // Limpa a mensagem de "buscando"
            if (!data.erro) {
                document.getElementById('logradouro').value = data.logradouro;
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('estado').value = data.uf;
            } else {
                statusMessage.textContent = "CEP não encontrado.";
                // Limpa os campos se o CEP for inválido
                document.getElementById('logradouro').value = '';
                document.getElementById('cidade').value = '';
                document.getElementById('estado').value = '';
            }
        })
        .catch(err => {
            console.error("Erro ao buscar CEP:", err);
            statusMessage.textContent = "Não foi possível buscar o CEP. Verifique sua conexão.";
        });
}


function cadastrarCandidato() {
    const signupMessage = document.getElementById('signupMessage');
    const senha = document.getElementById('senha').value;
    const confirmSenha = document.getElementById('confirmSenha').value;

    if (senha !== confirmSenha) {
        signupMessage.textContent = "As senhas não coincidem!";
        return;
    }
    if (senha.length < 8) {
        signupMessage.textContent = "A senha deve ter no mínimo 8 caracteres.";
        return;
    }

    const dadosCandidato = {
        nome: document.getElementById('nome').value,
        sobrenome: document.getElementById('sobrenome').value,
        email: document.getElementById('email').value,
        numeroTelefone: document.getElementById('numeroTelefone').value,
        dataNascimento: document.getElementById('dataNascimento').value,
        cpf: document.getElementById('cpf').value,
        cep: document.getElementById('cep').value,
        logradouro: document.getElementById('logradouro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        senha: senha
    };

    for (const key in dadosCandidato) {
        if (!dadosCandidato[key] && key !== 'logradouro') { // Logradouro pode ser nulo
            signupMessage.textContent = `O campo ${key.replace(/([A-Z])/g, ' $1')} é obrigatório.`;
            return;
        }
    }
    signupMessage.textContent = '';

    fetch(`${API_BASE_URL}/candidatos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosCandidato)
    })
    .then(async response => {
        if (response.ok) {
            alert("Cadastro realizado com sucesso! Faça o login para continuar.");
            window.location.href = "signInCandidato.html";
        } else {
            const errorData = await response.json().catch(() => ({ message: "Erro ao processar resposta do servidor." }));
            signupMessage.textContent = errorData.message || (Array.isArray(errorData.errors) ? errorData.errors.map(e => e.defaultMessage).join(', ') : "Ocorreu um erro.");
        }
    })
    .catch(error => {
        console.error("Erro na conexão:", error);
        signupMessage.textContent = "Erro de conexão com o servidor.";
    });
}