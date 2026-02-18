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
            const tbody = document.querySelector('#tabelaVagas tbody');
            tbody.innerHTML = ''; 
            
            vagas.forEach(vaga => {
                const statusBadge = vaga.status === 'ABERTA' ? '<span class="badge badge-success">Aberta</span>' : '<span class="badge badge-secondary">Fechada</span>';
                
                const nomeVaga = vaga.nomeVaga || vaga.nome || 'Sem Título';
                const setorVaga = vaga.setorVaga || 'N/A';

                const row = `
                    <tr>
                        <td>${nomeVaga}</td>
                        <td>${setorVaga}</td>
                        <td>${statusBadge}</td>
                        <td>
                            <button class="btn btn-sm btn-info" onclick="verVaga(${vaga.id})">Ver</button>
                            <button class="btn btn-sm btn-warning" onclick="verCandidatos(${vaga.id})">Candidatos</button>
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

function verVaga(id) {
    fetch(`http://localhost:8080/api/vagas/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar vaga');
            return response.json();
        })
        .then(vaga => {
            document.getElementById('modalNomeVaga').innerText = vaga.nomeVaga;
            document.getElementById('modalSetorVaga').innerText = vaga.setorVaga;
            document.getElementById('modalSalario').innerText = vaga.salario;
            document.getElementById('modalModalidade').innerText = vaga.modalidade;
            document.getElementById('modalNivel').innerText = vaga.nivelExperiencia;
            document.getElementById('modalStatus').innerText = vaga.status;
            document.getElementById('modalLocal').innerText = `${vaga.cidade} - ${vaga.estado}`;
            document.getElementById('modalData').innerText = new Date(vaga.dataPostagem).toLocaleDateString('pt-BR');
            document.getElementById('modalDescricao').innerText = vaga.descricaoVaga;

            document.getElementById('btnEditarModal').onclick = function() {
                editarVaga(vaga.id);
            };

            $('#vagaModal').modal('show');
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao carregar detalhes da vaga.');
        });
}

function verCandidatos(vagaId) {
    fetch(`http://localhost:8080/api/candidaturas/vaga/${vagaId}`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar candidatos');
            return response.json();
        })
        .then(candidaturas => {
            const tbody = document.querySelector('#tabelaCandidatos tbody');
            tbody.innerHTML = '';

            if (candidaturas.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum candidato inscrito.</td></tr>';
            } else {
                candidaturas.forEach(candidatura => {
                    const candidato = candidatura.candidato;
                    const dataInscricao = new Date(candidatura.dataInscricao).toLocaleDateString('pt-BR');

                    const row = `
                        <tr>
                            <td>${candidato.nome} ${candidato.sobrenome}</td>
                            <td>${candidato.email}</td>
                            <td>${candidato.numeroTelefone || 'N/A'}</td>
                            <td>${dataInscricao}</td>
                            <td>${candidatura.status}</td>
                        </tr>
                    `;
                    tbody.insertAdjacentHTML('beforeend', row);
                });
            }

            $('#candidatosModal').modal('show');
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao carregar candidatos.');
        });
}

function editarVaga(id) {
    window.location.href = `editarVaga.html?id=${id}`;
}

function deletarVaga(id) {
    if (confirm("Tem certeza que deseja deletar esta vaga?")) {
        fetch(`http://localhost:8080/api/vagas/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao deletar vaga');
            }
            alert('Vaga deletada com sucesso!');
            loadVagas();
        })
        .catch(error => console.error('Erro:', error));
    }
}
