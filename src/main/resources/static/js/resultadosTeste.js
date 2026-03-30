const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const testeId = urlParams.get('testeId');
    const testeTitulo = urlParams.get('testeTitulo');

    if (!testeId) {
        alert('ID do Teste não fornecido!');
        window.history.back();
        return;
    }

    if (testeTitulo) {
        document.getElementById('testeTitulo').innerText = testeTitulo;
    }

    carregarResultados(testeId);
});

async function carregarResultados(testeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/testes/${testeId}/submissoes`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        if (!response.ok) throw new Error('Falha ao carregar submissões.');

        const submissoes = await response.json();
        const tbody = document.getElementById('tabelaResultados');
        tbody.innerHTML = '';

        if (submissoes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">Nenhum candidato concluiu este teste ainda.</td></tr>';
            return;
        }

        submissoes.forEach(sub => {
            const dataSub = new Date(sub.dataSubmissao).toLocaleString('pt-BR');
            const nomeCandidato = sub.candidato ? `${sub.candidato.nome} ${sub.candidato.sobrenome}` : 'Desconhecido';
            let pontuacaoStr = sub.pontuacao !== null && sub.pontuacao !== undefined
                ? `${sub.pontuacao.toFixed(1)}%`
                : '<span class="text-muted">N/A (Discursivo)</span>';

            const tr = `
                <tr>
                    <td>${nomeCandidato}</td>
                    <td>${dataSub}</td>
                    <td>${pontuacaoStr}</td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="verDetalhesSubmissao(${sub.id}, ${testeId})">
                            <i class="zmdi zmdi-eye"></i> Ver Respostas
                        </button>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', tr);
        });

    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('tabelaResultados').innerHTML = `<tr><td colspan="4" class="text-center text-danger">Erro ao carregar resultados.</td></tr>`;
    }
}

function verDetalhesSubmissao(submissaoId, testeId) {
    window.location.href = `detalhesSubmissao.html?submissaoId=${submissaoId}&testeId=${testeId}`;
}