document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    loadPerfil();

    // Máscaras
    $('#cpf').mask('000.000.000-00');
    $('#telefone').mask('(00) 00000-0000');

    // Envio do formulário
    document.getElementById('perfilForm').addEventListener('submit', function(e) {
        e.preventDefault();
        atualizarPerfil();
    });
});

function checkLogin() {
    const recrutadorId = localStorage.getItem('recrutadorId');
    if (!recrutadorId) {
        window.location.href = 'signInRecrutador.html';
    }
}

function loadPerfil() {
    const recrutadorId = localStorage.getItem('recrutadorId');
    if (!recrutadorId) return;

    fetch(`http://localhost:8080/api/recrutadores/${recrutadorId}`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao carregar perfil');
            return response.json();
        })
        .then(recrutador => {
            document.getElementById('recrutadorId').value = recrutador.id;
            document.getElementById('nome').value = recrutador.nome;
            document.getElementById('sobrenome').value = recrutador.sobrenome;
            document.getElementById('cpf').value = recrutador.cpf;
            document.getElementById('cargo').value = recrutador.cargo;
            document.getElementById('email').value = recrutador.email;
            document.getElementById('telefone').value = recrutador.numeroTelefone;

            // Armazenar senha atual (hash) se vier, ou deixar em branco
            if (recrutador.senha) {
                document.getElementById('senha').dataset.current = recrutador.senha;
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao carregar dados do perfil.');
        });
}

function atualizarPerfil() {
    const recrutadorId = document.getElementById('recrutadorId').value;
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
        id: recrutadorId,
        nome: document.getElementById('nome').value,
        sobrenome: document.getElementById('sobrenome').value,
        cpf: document.getElementById('cpf').value.replace(/\D/g, ''),
        cargo: document.getElementById('cargo').value,
        email: document.getElementById('email').value,
        numeroTelefone: document.getElementById('telefone').value.replace(/\D/g, ''),
        senha: senha
    };

    fetch(`http://localhost:8080/api/recrutadores/${recrutadorId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosAtualizados)
    })
    .then(async response => {
        if (response.ok) {
            const novoRecrutador = await response.json();
            alert("Perfil atualizado com sucesso!");

            // Atualizar senha armazenada se mudou
            if (novoRecrutador.senha) {
                senhaInput.dataset.current = novoRecrutador.senha;
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
