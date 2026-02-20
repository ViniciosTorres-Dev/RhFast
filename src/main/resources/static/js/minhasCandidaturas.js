document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    loadCandidaturas();
});

function checkLogin() {
    const candidatoId = localStorage.getItem('candidatoId');
    if (!candidatoId) {
        window.location.href = 'signInCandidato.html';
    }
}

function loadCandidaturas() {
    const candidatoId = localStorage.getItem('candidatoId');
    if (!candidatoId) return;

    fetch(`http://localhost:8080/api/candidaturas/candidato/${candidatoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar candidaturas');
            }
            return response.json();
        })
        .then(candidaturas => {
            const tbody = document.querySelector('table tbody');
            tbody.innerHTML = '';

            if (candidaturas.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">Você ainda não se candidatou a nenhuma vaga.</td></tr>';
                return;
            }

            candidaturas.forEach(candidatura => {
                const vaga = candidatura.vaga;
                const empresaNome = vaga.empresa ? vaga.empresa.nome : 'Empresa Confidencial';
                const dataInscricao = new Date(candidatura.dataInscricao).toLocaleDateString('pt-BR');

                let statusBadge = '';
                switch(candidatura.status) {
                    case 'PENDENTE':
                        statusBadge = '<span class="badge badge-warning">Pendente</span>';
                        break;
                    case 'APROVADO':
                        statusBadge = '<span class="badge badge-success">Aprovado</span>';
                        break;
                    case 'REJEITADO':
                        statusBadge = '<span class="badge badge-danger">Rejeitado</span>';
                        break;
                    default:
                        statusBadge = '<span class="badge badge-secondary">' + candidatura.status + '</span>';
                }

                const row = `
                    <tr>
                        <td>${vaga.nomeVaga}</td>
                        <td>${empresaNome}</td>
                        <td>${dataInscricao}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button class="btn btn-sm btn-info" onclick="verVaga(${vaga.id})">Ver Vaga</button>
                            <button class="btn btn-sm btn-danger" onclick="cancelarCandidatura(${candidatura.id})">Cancelar</button>
                        </td>
                    </tr>
                `;
                tbody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(error => console.error('Erro:', error));
}

function verVaga(id) {
    window.location.href = `detalhesVaga.html?id=${id}`;
}

function cancelarCandidatura(id) {
    if (confirm("Tem certeza que deseja cancelar esta candidatura?")) {
        fetch(`http://localhost:8080/api/candidaturas/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao cancelar candidatura');
            }
            alert('Candidatura cancelada com sucesso!');
            loadCandidaturas();
        })
        .catch(error => console.error('Erro:', error));
    }
}