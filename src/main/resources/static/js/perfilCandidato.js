document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    loadPerfil();

    // Máscaras
    $('#cpf').mask('000.000.000-00');
    $('#telefone').mask('(00) 00000-0000');
    $('#cep').mask('00000-000');

    // Busca de CEP
    document.getElementById('cep').addEventListener('blur', function() {
        buscarCep(this.value);
    });

    // Envio do formulário
    document.getElementById('perfilForm').addEventListener('submit', function(e) {
        e.preventDefault();
        atualizarPerfil();
    });
});

function checkLogin() {
    const candidatoId = localStorage.getItem('candidatoId');
    if (!candidatoId) {
        window.location.href = 'signInCandidato.html';
    }
}

function loadPerfil() {
    const candidatoId = localStorage.getItem('candidatoId');
    if (!candidatoId) return;

    fetch(`http://localhost:8080/api/candidatos/${candidatoId}`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao carregar perfil');
            return response.json();
        })
        .then(candidato => {
            document.getElementById('candidatoId').value = candidato.id;
            document.getElementById('nome').value = candidato.nome;
            document.getElementById('sobrenome').value = candidato.sobrenome;
            document.getElementById('cpf').value = candidato.cpf;
            document.getElementById('dataNascimento').value = candidato.dataNascimento;
            document.getElementById('email').value = candidato.email;
            document.getElementById('telefone').value = candidato.numeroTelefone;
            document.getElementById('situacao').value = candidato.situacao;
            document.getElementById('cep').value = candidato.cep;
            document.getElementById('logradouro').value = candidato.logradouro;
            document.getElementById('estado').value = candidato.estado;
            document.getElementById('cidade').value = candidato.cidade;

            // Armazenar senha atual (hash) se vier, ou deixar em branco
            if (candidato.senha) {
                document.getElementById('senha').dataset.current = candidato.senha;
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao carregar dados do perfil.');
        });
}

function buscarCep(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('logradouro').value = data.logradouro;
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('estado').value = data.uf;
                } else {
                    alert("CEP não encontrado.");
                }
            })
            .catch(err => console.error("Erro ao buscar CEP", err));
    }
}

function atualizarPerfil() {
    const candidatoId = document.getElementById('candidatoId').value;
    const senhaInput = document.getElementById('senha');
    let senha = senhaInput.value;

    // Se o usuário não digitou nova senha, tenta usar a atual armazenada
    if (!senha || senha.trim() === "") {
        senha = senhaInput.dataset.current;
    }

    if (!senha) {
        alert("Por favor, digite sua senha atual ou uma nova senha para confirmar as alterações.");
        senhaInput.focus();
        return;
    }

    const dadosAtualizados = {
        id: candidatoId,
        nome: document.getElementById('nome').value,
        sobrenome: document.getElementById('sobrenome').value,
        cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
        dataNascimento: document.getElementById('dataNascimento').value,
        email: document.getElementById('email').value,
        numeroTelefone: document.getElementById('telefone').value.replace(/\D/g, ''),
        situacao: document.getElementById('situacao').value,
        cep: document.getElementById('cep').value.replace(/\D/g, ''),
        logradouro: document.getElementById('logradouro').value,
        estado: document.getElementById('estado').value,
        cidade: document.getElementById('cidade').value,
        senha: senha
    };

    fetch(`http://localhost:8080/api/candidatos/${candidatoId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosAtualizados)
    })
    .then(async response => {
        if (response.ok) {
            const novoCandidato = await response.json();
            alert("Perfil atualizado com sucesso!");

            // Atualizar senha armazenada se mudou
            if (novoCandidato.senha) {
                senhaInput.dataset.current = novoCandidato.senha;
            }
            senhaInput.value = ""; // Limpar campo de senha
        } else {
            // Tenta ler o erro como JSON, se falhar, usa texto padrão
            try {
                const erroObj = await response.json();
                alert(erroObj.mensagem || "Erro ao atualizar perfil. Verifique os dados.");
            } catch (e) {
                alert("Erro ao atualizar perfil. Verifique os dados.");
            }
        }
    })
    .catch(error => console.error('Erro:', error));
}
