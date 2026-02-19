document.addEventListener('DOMContentLoaded', function() {
    checkLogin();

    const urlParams = new URLSearchParams(window.location.search);
    const vagaId = urlParams.get('id');

    if (vagaId) {
        carregarVaga(vagaId);
    } else {
        alert("Vaga não especificada.");
        window.location.href = "mainRecrutador.html";
    }

    const form = document.getElementById('editarVagaForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            atualizarVaga();
        });
    }

    // Máscara de CEP
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            e.target.value = value;
        });

        cepInput.addEventListener('blur', function() {
            buscarCep(this.value);
        });
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
            document.getElementById('vagaId').value = vaga.id;
            document.getElementById('nomeVaga').value = vaga.nomeVaga;
            document.getElementById('setorVaga').value = vaga.setorVaga;
            document.getElementById('pais').value = vaga.pais;
            document.getElementById('estado').value = vaga.estado;
            document.getElementById('cidade').value = vaga.cidade;
            document.getElementById('cep').value = vaga.cep;
            document.getElementById('nivelExperiencia').value = vaga.nivelExperiencia;
            document.getElementById('modalidade').value = vaga.modalidade;
            document.getElementById('salario').value = vaga.salario;
            document.getElementById('descricaoVaga').value = vaga.descricaoVaga;
            document.getElementById('status').value = vaga.status;
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao carregar dados da vaga.');
            window.location.href = "mainRecrutador.html";
        });
}

function buscarCep(cep) {
    cep = cep.replace(/\D/g, '');
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('estado').value = data.uf;
                } else {
                    alert("CEP não encontrado.");
                }
            })
            .catch(err => console.error("Erro ao buscar CEP", err));
    }
}

function atualizarVaga() {
    const vagaId = document.getElementById('vagaId').value;
    const recrutadorId = localStorage.getItem('recrutadorId');

    if (!recrutadorId) {
        alert("Erro: Recrutador não identificado. Faça login novamente.");
        window.location.href = "signInRecrutador.html";
        return;
    }

    const dadosVaga = {
        id: vagaId,
        nomeVaga: document.getElementById('nomeVaga').value,
        setorVaga: document.getElementById('setorVaga').value,
        pais: document.getElementById('pais').value,
        estado: document.getElementById('estado').value,
        cidade: document.getElementById('cidade').value,
        cep: document.getElementById('cep').value.replace(/\D/g, ''),
        status: document.getElementById('status').value,
        nivelExperiencia: document.getElementById('nivelExperiencia').value,
        modalidade: document.getElementById('modalidade').value,
        salario: parseFloat(document.getElementById('salario').value),
        descricaoVaga: document.getElementById('descricaoVaga').value,
        recrutador: { id: parseInt(recrutadorId) }
    };

    fetch(`http://localhost:8080/api/vagas/${vagaId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosVaga)
    })
    .then(async response => {
        if (response.ok) {
            alert("Vaga atualizada com sucesso!");
            window.location.href = "mainRecrutador.html";
        } else {
            const erroObj = await response.json();
            alert(erroObj.mensagem || "Erro ao atualizar vaga.");
        }
    })
    .catch(error => console.error("Erro na conexão:", error));
}