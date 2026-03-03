document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    const urlParams = new URLSearchParams(window.location.search);
    const vagaId = urlParams.get('id');

    if (vagaId) {
        loadVaga(vagaId);
    } else {
        alert('Vaga não encontrada!');
        window.location.href = 'mainRecrutador.html';
    }
});

function checkLogin() {
    const recrutadorId = localStorage.getItem('recrutadorId');
    if (!recrutadorId) {
        window.location.href = 'signInRecrutador.html';
    }
}

function loadVaga(id) {
    fetch(`http://localhost:8080/api/vagas/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao carregar vaga');
            return response.json();
        })
        .then(vaga => {
            document.getElementById('tituloVaga').textContent = vaga.nomeVaga;
            document.getElementById('empresaVaga').textContent = vaga.empresa ? vaga.empresa.nome : 'Empresa Confidencial';
            document.getElementById('localVaga').textContent = `${vaga.cidade} - ${vaga.estado}`;
            document.getElementById('modalidadeVaga').textContent = vaga.modalidade;
            document.getElementById('nivelVaga').textContent = vaga.nivelExperiencia;
            document.getElementById('salarioVaga').textContent = vaga.salario;
            document.getElementById('setorVaga').textContent = vaga.setorVaga;
            document.getElementById('dataVaga').textContent = new Date(vaga.dataPostagem).toLocaleDateString();
            document.getElementById('descricaoVaga').textContent = vaga.descricaoVaga;

            const statusBadge = document.getElementById('statusBadge');
            statusBadge.textContent = vaga.status;

            if (vaga.status === 'ABERTA') {
                statusBadge.className = 'badge badge-success';
            } else if (vaga.status === 'ENCERRADA') {
                statusBadge.className = 'badge badge-secondary';
            } else {
                statusBadge.className = 'badge badge-danger';
            }

            // Carregar candidatos se houver
            if (vaga.candidaturas) {
                loadCandidatos(vaga.candidaturas);
            } else {
                loadCandidatos([]);
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao carregar detalhes da vaga.');
        });
}

function loadCandidatos(candidaturas) {
    const tbody = document.querySelector('#tabelaCandidatos tbody');
    const countSpan = document.getElementById('countCandidatos');
    tbody.innerHTML = '';

    if (!candidaturas || candidaturas.length === 0) {
        countSpan.textContent = '0';
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum candidato inscrito ainda.</td></tr>';
        return;
    }

    countSpan.textContent = candidaturas.length;

    candidaturas.forEach(candidatura => {
        const nomeCandidato = candidatura.candidato ? `${candidatura.candidato.nome} ${candidatura.candidato.sobrenome}` : 'Candidato Desconhecido';
        const dataInscricao = new Date(candidatura.dataInscricao).toLocaleDateString();

        const row = `
            <tr>
                <td>${nomeCandidato}</td>
                <td>${dataInscricao}</td>
                <td>${candidatura.status}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="verPerfilCandidato(${candidatura.candidato ? candidatura.candidato.id : 0})">Ver Perfil</button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function editarVaga() {
    const urlParams = new URLSearchParams(window.location.search);
    const vagaId = urlParams.get('id');
    window.location.href = `editarVaga.html?id=${vagaId}`;
}

function verPerfilCandidato(id) {
    if (id === 0) {
        alert('Perfil não disponível.');
        return;
    }
    // Implementar visualização do perfil do candidato (modal ou nova página)
    alert('Funcionalidade de ver perfil do candidato em desenvolvimento.');
}
