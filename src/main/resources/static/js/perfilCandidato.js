const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    loadPerfil();
    carregarCurriculos();

    // Máscaras
    $('#cpf').mask('000.000.000-00');
    $('#telefone').mask('(00) 00000-0000');
    $('#cep').mask('00000-000');

    // Busca de CEP
    document.getElementById('cep').addEventListener('blur', function() {
        buscarCep(this.value);
    });

    // Envio do formulário de perfil
    document.getElementById('perfilForm').addEventListener('submit', function(e) {
        e.preventDefault();
        atualizarPerfil();
    });

    // Upload de Currículo
    document.getElementById('uploadCurriculoForm').addEventListener('submit', function(e) {
        e.preventDefault();
        fazerUploadCurriculo();
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

    fetch(`${API_BASE_URL}/candidatos/${candidatoId}`)
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

    fetch(`${API_BASE_URL}/candidatos/${candidatoId}`, {
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

async function carregarCurriculos() {
    const candidatoId = localStorage.getItem('candidatoId');
    if (!candidatoId) return;

    const container = document.getElementById('listaCurriculos');

    try {
        const response = await fetch(`${API_BASE_URL}/curriculos/candidato/${candidatoId}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        if (!response.ok) throw new Error('Falha ao buscar currículos.');

        const curriculos = await response.json();
        container.innerHTML = '';

        if (curriculos.length === 0) {
            container.innerHTML = '<p class="text-white-50 small mb-0">Você ainda não enviou nenhum currículo.</p>';
            return;
        }

        curriculos.forEach(curriculo => {
            const div = document.createElement('div');
            div.className = 'd-flex justify-content-between align-items-center mb-2 p-2 border border-light rounded';
            div.innerHTML = `
                <div>
                    <i class="zmdi zmdi-file-text text-info mr-2"></i>
                    <span class="text-white">${curriculo.nomeCurriculo}</span>
                </div>
                <div>
                    <a href="${API_BASE_URL}/files/${curriculo.urlCurriculo}" target="_blank" class="btn btn-sm btn-outline-light mr-1" title="Ver Currículo"><i class="zmdi zmdi-eye"></i></a>
                    <button class="btn btn-sm btn-outline-danger" onclick="apagarCurriculo(${curriculo.id})" title="Apagar Currículo"><i class="zmdi zmdi-delete"></i></button>
                </div>
            `;
            container.appendChild(div);
        });

    } catch (error) {
        console.error(error);
        container.innerHTML = '<p class="text-danger small">Erro ao carregar currículos.</p>';
    }
}

async function fazerUploadCurriculo() {
    const candidatoId = localStorage.getItem('candidatoId');
    const fileInput = document.getElementById('arquivoCurriculo');
    const btn = document.querySelector('#uploadCurriculoForm button');

    if (fileInput.files.length === 0) {
        alert("Por favor, selecione um arquivo.");
        return;
    }

    btn.disabled = true;
    btn.innerHTML = 'Enviando...';

    const formData = new FormData();
    formData.append('arquivo', fileInput.files[0]);

    try {
        const response = await fetch(`${API_BASE_URL}/curriculos/upload/${candidatoId}`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: formData
        });

        if (response.ok) {
            alert('Currículo enviado com sucesso!');
            fileInput.value = ''; // Limpa o input
            carregarCurriculos(); // Atualiza a lista
        } else {
            alert('Erro ao enviar currículo. Tente novamente.');
        }
    } catch (error) {
        console.error(error);
        alert('Erro de conexão ao enviar o currículo.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="zmdi zmdi-upload"></i> Enviar Currículo';
    }
}

async function apagarCurriculo(id) {
    if (!confirm("Tem certeza que deseja apagar este currículo?")) return;

    try {
        const response = await fetch(`${API_BASE_URL}/curriculos/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        if (response.ok) {
            carregarCurriculos();
        } else {
            alert("Erro ao apagar currículo.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão ao apagar currículo.");
    }
}
