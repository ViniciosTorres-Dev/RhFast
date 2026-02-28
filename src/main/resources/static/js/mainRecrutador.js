document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    loadVagas();
    loadCandidatosRecentes();
    loadStats();
});

function checkLogin() {
    const recrutadorId = localStorage.getItem('recrutadorId');
    if (!recrutadorId) {
        window.location.href = 'signInRecrutador.html';
    }
    // Se estiver logado como candidato, redireciona ou limpa
    if (localStorage.getItem('candidatoId')) {
        localStorage.removeItem('candidatoId');
    }
}

function loadVagas() {
    const recrutadorId = localStorage.getItem('recrutadorId'); 
    if (!recrutadorId) return;

    fetch(`http://localhost:8080/api/vagas/recrutador/${recrutadorId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar vagas');
            }
            return response.json();
        })
        .then(vagas => {
            const tbody = document.querySelector('table tbody');
            tbody.innerHTML = ''; 
            
            vagas.forEach(vaga => {
                const statusBadge = vaga.status === 'ABERTA' ? '<span class="badge badge-success">Aberta</span>' : (vaga.status === 'ENCERRADA' ? '<span class="badge badge-secondary">Encerrada</span>' : '<span class="badge badge-tertiary">Cancelada</span>');
                
                const nomeVaga = vaga.nomeVaga || vaga.nome || 'Sem Título';
                const numCandidatos = vaga.candidaturas ? vaga.candidaturas.length : 0;

                const row = `
                    <tr>
                        <td>${nomeVaga}</td>
                        <td>${numCandidatos}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button class="btn btn-sm btn-info" onclick="verVaga(${vaga.id})">Ver</button>
                            <button class="btn btn-sm btn-secondary" onclick="editarVaga(${vaga.id})">Editar</button>
                            <button class="btn btn-sm btn-danger" onclick="deletarVaga(${vaga.id})">Deletar</button>
                        </td>
                    </tr>
                `;
                tbody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(error => console.error('Erro:', error));
}

function loadCandidatosRecentes() {
    const recrutadorId = localStorage.getItem('recrutadorId');
    if (!recrutadorId) return;

    fetch(`http://localhost:8080/api/candidaturas/recentes/recrutador/${recrutadorId}`)
        .then(response => response.json())
        .then(candidaturas => {
            const container = document.querySelector('.col-md-4 .list-group');
            container.innerHTML = '';

            candidaturas.forEach(candidatura => {
                const item = `
                    <div class="list-group-item list-group-item-action flex-column align-items-start">
                        <div class="d-flex w-100 justify-content-between">
                            <h5 class="mb-1">${candidatura.candidatoNome}</h5>
                            <small>${new Date(candidatura.dataInscricao).toLocaleDateString()}</small>
                        </div>
                        <p class="mb-1">Vaga: ${candidatura.vagaNome}</p>
                        <small>Status: ${candidatura.status}</small>
                    </div>
                `;
                container.insertAdjacentHTML('beforeend', item);
            });
        })
        .catch(error => console.error('Erro ao carregar candidatos recentes:', error));
}

function loadStats() {
    const recrutadorId = localStorage.getItem('recrutadorId');
    if (!recrutadorId) return;

    fetch(`http://localhost:8080/api/stats/recrutador/${recrutadorId}`)
        .then(response => response.json())
        .then(stats => {
            document.getElementById('totalVagas').textContent = stats.totalVagas;
            document.getElementById('totalCandidatos').textContent = stats.totalCandidatos;
            document.getElementById('vagasAbertas').textContent = stats.vagasAbertas;
        })
        .catch(error => console.error('Erro ao carregar estatísticas:', error));
}

function verVaga(id) {
    window.location.href = `detalhesVaga.html?id=${id}`;
}

function editarVaga(id) {
    window.location.href = `editarVaga.html?id=${id}`;
}

function deletarVaga(id) {
    if (confirm('Tem certeza que deseja deletar esta vaga?')) {
        fetch(`http://localhost:8080/api/vagas/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                loadVagas();
                loadStats();
            } else {
                alert('Erro ao deletar vaga');
            }
        })
        .catch(error => console.error('Erro:', error));
    }
}
