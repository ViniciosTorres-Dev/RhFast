document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    loadVagas();
});

function checkLogin() {
    const recrutadorId = localStorage.getItem('recrutadorId');
    if (!recrutadorId) {
        window.location.href = 'signInRecrutador.html';
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

                // Buscar candidaturas para esta vaga para obter a contagem
                fetch(`http://localhost:8080/api/candidaturas/vaga/${vaga.id}`)
                    .then(res => res.json())
                    .then(candidaturas => {
                        const numCandidatos = candidaturas.length;

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
                    })
                    .catch(err => {
                        console.error('Erro ao buscar candidaturas da vaga ' + vaga.id, err);
                         const row = `
                            <tr>
                                <td>${nomeVaga}</td>
                                <td>0</td>
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
            });
        })
        .catch(error => console.error('Erro:', error));
}

function verVaga(id) {
    window.location.href = `detalhesVagaRecrutador.html?id=${id}`;
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
            } else {
                alert('Erro ao deletar vaga');
            }
        })
        .catch(error => console.error('Erro:', error));
    }
}
