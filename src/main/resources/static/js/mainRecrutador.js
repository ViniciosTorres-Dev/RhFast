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
                const numCandidatos = vaga.candidatosCount !== undefined ? vaga.candidatosCount : (vaga.candidatos ? vaga.candidatos.length : 0);

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
    // Implementação futura
}

function loadStats() {
    // Implementação futura
}

function verVaga(id) {
    fetch(`http://localhost:8080/api/vagas/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar vaga');
            }
            return response.json();
        })
        .then(vaga => {
            document.getElementById('modalNomeVaga').innerText = vaga.nomeVaga || vaga.nome;
            document.getElementById('modalSetorVaga').innerText = vaga.setorVaga;
            document.getElementById('modalSalario').innerText = vaga.salario;
            document.getElementById('modalModalidade').innerText = vaga.modalidade;
            document.getElementById('modalNivel').innerText = vaga.nivelExperiencia;
            document.getElementById('modalStatus').innerText = vaga.status;
            document.getElementById('modalLocal').innerText = `${vaga.cidade} - ${vaga.estado}`;
            document.getElementById('modalData').innerText = new Date(vaga.dataPostagem).toLocaleDateString('pt-BR');
            document.getElementById('modalDescricao').innerText = vaga.descricaoVaga;

            const btnEditar = document.getElementById('btnEditarModal');
            btnEditar.onclick = function() {
                editarVaga(vaga.id);
            };

            $('#vagaModal').modal('show');
        })
        .catch(error => console.error('Erro:', error));
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