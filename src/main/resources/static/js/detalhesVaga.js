const API_BASE_URL = 'http://localhost:8080/api';
let vagaId = null;
let candidatoId = null;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    vagaId = urlParams.get('id');
    candidatoId = localStorage.getItem('candidatoId');

    if (!vagaId) {
        alert('ID da vaga não fornecido!');
        window.history.back();
        return;
    }

    carregarDetalhesVaga();
});

async function carregarDetalhesVaga() {
    try {
        const response = await fetch(`${API_BASE_URL}/vagas/${vagaId}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (!response.ok) throw new Error('Falha ao carregar detalhes da vaga.');

        const vaga = await response.json();
        document.getElementById('tituloVaga').innerText = vaga.nomeVaga;

        if (vaga.recrutador) {
            document.getElementById('empresaVaga').innerText = vaga.empresa ? vaga.empresa.nome : 'Empresa Confidencial';
            document.getElementById('empresaVagaLink').href = `perfilPublicoRecrutador.html?id=${vaga.recrutador.id}`;
        }

        document.getElementById('localVaga').innerText = `${vaga.cidade}, ${vaga.estado}`;
        document.getElementById('modalidadeVaga').innerText = vaga.modalidade;
        document.getElementById('salarioVaga').innerText = vaga.salario ? `R$ ${vaga.salario.toFixed(2)}` : 'A combinar';
        document.getElementById('nivelVaga').innerText = vaga.nivelExperiencia;
        document.getElementById('setorVaga').innerText = vaga.setorVaga;
        document.getElementById('dataVaga').innerText = `Publicada em: ${new Date(vaga.dataPostagem).toLocaleDateString('pt-BR')}`;
        document.getElementById('descricaoVaga').innerText = vaga.descricaoVaga;

        verificarStatusCandidatura();
        carregarTestesDaVaga(vaga.testes);

    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar detalhes da vaga.');
    }
}

async function verificarStatusCandidatura() {
    if (!candidatoId) {
        document.getElementById('divBotaoCandidatar').innerHTML = '<button class="btn btn-primary btn-lg" onclick="candidatarSe()">Candidatar-se a esta Vaga</button>';
        return;
    }
    try {
        const response = await fetch(`${API_BASE_URL}/candidaturas/candidato/${candidatoId}/vagas`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (!response.ok) return;

        const vagasInscritasIds = await response.json();
        if (vagasInscritasIds.includes(parseInt(vagaId))) {
            document.getElementById('divBotaoCandidatar').innerHTML = '<p class="text-success">Você já se candidatou a esta vaga.</p>';
            document.getElementById('secaoTestes').style.display = 'block';
        } else {
            document.getElementById('divBotaoCandidatar').innerHTML = '<button class="btn btn-primary btn-lg" onclick="candidatarSe()">Candidatar-se a esta Vaga</button>';
        }
    } catch (e) {
        console.error("Erro ao verificar candidatura:", e);
    }
}

async function carregarTestesDaVaga(testes) {
    const listaTestes = document.getElementById('listaTestes');
    if (!testes || testes.length === 0) {
        listaTestes.innerHTML = '<p class="text-muted">Nenhum teste associado a esta vaga.</p>';
        return;
    }

    listaTestes.innerHTML = '';
    for (const teste of testes) {
        let statusBotao = `<button class="btn btn-info" onclick="realizarTeste(${teste.id})">Realizar Teste</button>`;

        if (candidatoId) {
            try {
                const statusResponse = await fetch(`${API_BASE_URL}/testes/${teste.id}/candidato/${candidatoId}/status`, {
                    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
                });
                if (statusResponse.ok) {
                    const statusData = await statusResponse.json();
                    if (statusData.concluido) {
                        statusBotao = `<button class="btn btn-success" disabled>Teste Concluído</button>`;
                    }
                }
            } catch (e) {
                console.error(`Erro ao verificar status do teste ${teste.id}:`, e);
            }
        }

        const div = document.createElement('div');
        div.className = 'd-flex justify-content-between align-items-center border-bottom border-light py-2';
        div.innerHTML = `
            <div>
                <h6 class="mb-0 text-white">${teste.titulo}</h6>
                <small class="text-white-50">${teste.descricao}</small>
            </div>
            <div>
                ${statusBotao}
            </div>
        `;
        listaTestes.appendChild(div);
    }
}

async function candidatarSe() {
    if (!candidatoId) {
        alert('Você precisa estar logado como candidato para se inscrever.');
        window.location.href = 'signInCandidato.html';
        return;
    }

    const btn = document.querySelector('#divBotaoCandidatar button');
    btn.disabled = true;
    btn.innerText = 'Inscrevendo...';

    try {
        const response = await fetch(`${API_BASE_URL}/candidaturas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: JSON.stringify({ idCandidato: candidatoId, idVaga: vagaId })
        });

        if (response.ok) {
            alert('Candidatura realizada com sucesso!');
            verificarStatusCandidatura();
        } else {
            const err = await response.json();
            alert('Erro: ' + (err.message || 'Não foi possível se candidatar.'));
            btn.disabled = false;
            btn.innerText = 'Candidatar-se a esta Vaga';
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão ao se candidatar.');
        btn.disabled = false;
        btn.innerText = 'Candidatar-se a esta Vaga';
    }
}

function realizarTeste(testeId) {
    window.location.href = `realizarTeste.html?testeId=${testeId}`;
}

function voltar() {
    window.history.back();
}
