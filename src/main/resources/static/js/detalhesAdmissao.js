const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const processoId = urlParams.get('processoId');

    if (!processoId) {
        alert('ID do Processo de Admissão não fornecido.');
        window.history.back();
        return;
    }
    carregarDetalhesAdmissao(processoId);
});

async function carregarDetalhesAdmissao(processoId) {
    try {
        const response = await fetch(`${API_BASE_URL}/onboarding/processo/${processoId}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (!response.ok) throw new Error('Falha ao carregar dados da admissão.');

        const processo = await response.json();

        document.getElementById('nomeVaga').innerText = processo.vaga.nomeVaga;
        document.getElementById('nomeCandidato').innerText = `${processo.candidato.nome} ${processo.candidato.sobrenome}`;

        const container = document.getElementById('documentosContainer');
        container.innerHTML = '';

        if (!processo.documentosExigidos || processo.documentosExigidos.length === 0) {
            container.innerHTML = '<p class="text-muted">Nenhum documento foi exigido neste processo.</p>';
            return;
        }

        processo.documentosExigidos.forEach(doc => {
            const div = document.createElement('div');
            div.className = `doc-card status-${doc.status.toLowerCase()}`;

            let acoesRecrutador = '';
            if (doc.status === 'ENVIADO') {
                acoesRecrutador = `
                    <div class="mt-3">
                        <button class="btn btn-sm btn-success" onclick="avaliarDocumento(${doc.id}, 'APROVADO')">Aprovar</button>
                        <button class="btn btn-sm btn-danger ml-2" onclick="rejeitarDocumento(${doc.id})">Rejeitar</button>
                    </div>
                `;
            }

            let linkDocumento = '<p class="small text-muted mb-0">Candidato ainda não enviou.</p>';
            if(doc.caminhoArquivoEnviado) {
                linkDocumento = `<a href="${API_BASE_URL}/files/${doc.caminhoArquivoEnviado}" target="_blank" class="btn btn-sm btn-outline-info">Ver Documento Enviado</a>`;
            }

            div.innerHTML = `
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h6 class="text-white mb-1">${doc.nomeDocumento}</h6>
                        <p class="small text-white-50 mb-2">Status: ${doc.status.replace('_', ' ')}</p>
                        ${linkDocumento}
                    </div>
                    ${acoesRecrutador}
                </div>
                ${doc.status === 'REJEITADO' ? `<p class="small text-danger mt-2 mb-0">Motivo: ${doc.observacaoRecrutador}</p>` : ''}
            `;
            container.appendChild(div);
        });

    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('documentosContainer').innerHTML = '<p class="text-danger">Erro ao carregar documentos.</p>';
    }
}

function rejeitarDocumento(docId) {
    const motivo = prompt("Por favor, informe o motivo da rejeição para o candidato:");
    if (motivo && motivo.trim() !== '') {
        avaliarDocumento(docId, 'REJEITADO', motivo);
    }
}

async function avaliarDocumento(docId, status, observacao = '') {
    const url = `${API_BASE_URL}/onboarding/documento/${docId}/avaliar?status=${status}&observacao=${encodeURIComponent(observacao)}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        if (response.ok) {
            alert(`Documento ${status.toLowerCase()} com sucesso!`);
            const urlParams = new URLSearchParams(window.location.search);
            carregarDetalhesAdmissao(urlParams.get('processoId')); // Recarrega a lista
        } else {
            const err = await response.json();
            alert('Erro ao avaliar documento: ' + (err.message || 'Tente novamente.'));
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão ao avaliar o documento.');
    }
}
