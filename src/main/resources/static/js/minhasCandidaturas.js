const API_BASE_URL = 'http://localhost:8080/api';

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

    fetch(`${API_BASE_URL}/candidaturas/candidato/${candidatoId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar candidaturas');
            }
            return response.json();
        })
        .then(async candidaturas => {
            const tbody = document.querySelector('#tabelaCandidaturas tbody');
            tbody.innerHTML = '';

            if (candidaturas.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">Você ainda não se candidatou a nenhuma vaga.</td></tr>';
                return;
            }

            // Buscar processos de onboarding desse candidato
            let processos = [];
            try {
                const resProcessos = await fetch(`${API_BASE_URL}/onboarding/candidato/${candidatoId}`, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                if(resProcessos.ok) processos = await resProcessos.json();
            } catch (e) {
                console.warn('Não foi possível carregar processos de onboarding', e);
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
                    case 'EM_TESTE':
                        statusBadge = '<span class="badge badge-info">Em Teste</span>';
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

                let acoes = `<button class="btn btn-sm btn-info" onclick="verVaga(${vaga.id})">Ver Vaga</button> `;
                acoes += `<button class="btn btn-sm btn-danger" onclick="cancelarCandidatura(${candidatura.id})">Cancelar</button> `;

                // Verifica se há processo de admissão
                const processo = processos.find(p => p.vaga.id === vaga.id);
                if (processo) {
                    acoes += `<button class="btn btn-sm btn-success mt-1" onclick="abrirOnboarding(${processo.id})"><i class="zmdi zmdi-file-text"></i> Minha Admissão</button>`;
                }

                const row = `
                    <tr>
                        <td>${vaga.nomeVaga}</td>
                        <td>${empresaNome}</td>
                        <td>${dataInscricao}</td>
                        <td>${statusBadge}</td>
                        <td>
                            ${acoes}
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
        fetch(`${API_BASE_URL}/candidaturas/${id}`, {
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

function abrirOnboarding(processoId) {
    window.location.href = `meuOnboarding.html?processoId=${processoId}`;
}
