const API_BASE_URL = 'http://localhost:8080/api';

let todasAsVagas = []; // Cache para armazenar os dados e evitar múltiplas chamadas à API

document.addEventListener('DOMContentLoaded', () => {
    if (checkLogin()) {
        loadVagasDaEmpresa();
    }
    setupFilters();
});

function checkLogin() {
    const recrutadorId = localStorage.getItem('recrutadorId');
    if (!recrutadorId) {
        window.location.href = 'signInRecrutador.html';
        return false;
    }
    return recrutadorId;
}

async function loadVagasDaEmpresa() {
    const recrutadorId = localStorage.getItem('recrutadorId');
    const tbody = document.getElementById('tabelaVagasEmpresa');
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">Carregando vagas...</td></tr>';

    try {
        // 1. Buscar o recrutador para obter o ID da empresa
        const recrutadorResponse = await fetch(`${API_BASE_URL}/recrutadores/${recrutadorId}`);
        if (!recrutadorResponse.ok) throw new Error('Falha ao buscar dados do recrutador.');
        const recrutador = await recrutadorResponse.json();
        const empresaId = recrutador.empresa.id;

        if (!empresaId) throw new Error('ID da empresa não encontrado para este recrutador.');

        // 2. Buscar todas as vagas da empresa
        const vagasResponse = await fetch(`${API_BASE_URL}/vagas/empresa/${empresaId}`);
        if (!vagasResponse.ok) throw new Error('Falha ao buscar vagas da empresa.');
        const vagas = await vagasResponse.json();

        // 3. Para cada vaga, buscar a contagem de candidatos
        const vagasComContagem = await Promise.all(vagas.map(async (vaga) => {
            const candResponse = await fetch(`${API_BASE_URL}/candidaturas/vaga/${vaga.id}`);
            const candidaturas = await candResponse.json();
            return { ...vaga, totalCandidatos: candidaturas.length };
        }));

        todasAsVagas = vagasComContagem; // Armazena no cache
        document.getElementById('totalVagasCount').textContent = `${todasAsVagas.length} Vagas Encontradas`;
        renderTabela(todasAsVagas);

    } catch (error) {
        console.error('Erro ao carregar vagas da empresa:', error);
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">${error.message}</td></tr>`;
    }
}

function setupFilters() {
    document.getElementById('filtroStatus').addEventListener('change', applyFilters);
    document.getElementById('filtroTempo').addEventListener('change', applyFilters);
    document.getElementById('filtroSetor').addEventListener('keyup', applyFilters);
    document.getElementById('filtroCandidatos').addEventListener('keyup', applyFilters);
}

function applyFilters() {
    const status = document.getElementById('filtroStatus').value;
    const tempo = document.getElementById('filtroTempo').value;
    const setor = document.getElementById('filtroSetor').value.toLowerCase();
    const candidatos = parseInt(document.getElementById('filtroCandidatos').value, 10) || 0;

    let vagasFiltradas = todasAsVagas;

    // Filtro por Status
    if (status) {
        vagasFiltradas = vagasFiltradas.filter(vaga => vaga.status === status);
    }

    // Filtro por Tempo
    if (tempo) {
        const hoje = new Date();
        const dataLimite = new Date(hoje.setDate(hoje.getDate() - parseInt(tempo, 10)));
        vagasFiltradas = vagasFiltradas.filter(vaga => new Date(vaga.dataPostagem) >= dataLimite);
    }

    // Filtro por Setor
    if (setor) {
        vagasFiltradas = vagasFiltradas.filter(vaga => vaga.setorVaga && vaga.setorVaga.toLowerCase().includes(setor));
    }

    // Filtro por Quantidade de Candidatos
    if (candidatos > 0) {
        vagasFiltradas = vagasFiltradas.filter(vaga => vaga.totalCandidatos >= candidatos);
    }

    renderTabela(vagasFiltradas);
}

function renderTabela(vagas) {
    const tbody = document.getElementById('tabelaVagasEmpresa');
    tbody.innerHTML = '';

    if (vagas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhuma vaga encontrada com os filtros aplicados.</td></tr>';
        return;
    }

    vagas.forEach(vaga => {
        const statusBadge = getStatusBadge(vaga.status);
        const dataPostagem = new Date(vaga.dataPostagem).toLocaleDateString('pt-BR');

        const row = `
            <tr>
                <td>${vaga.nomeVaga}</td>
                <td>${vaga.setorVaga || '-'}</td>
                <td>${statusBadge}</td>
                <td><span class="badge badge-info">${vaga.totalCandidatos}</span></td>
                <td>${dataPostagem}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="verVaga(${vaga.id})"><i class="zmdi zmdi-eye"></i> Ver</button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function getStatusBadge(status) {
    if (status === 'ABERTA') return '<span class="badge badge-success">Aberta</span>';
    if (status === 'ENCERRADA') return '<span class="badge badge-secondary">Encerrada</span>';
    return '<span class="badge badge-danger">Cancelada</span>';
}

function verVaga(id) {
    window.location.href = `detalhesVagaRecrutador.html?id=${id}`;
}
