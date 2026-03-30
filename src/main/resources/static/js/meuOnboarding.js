const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const processoId = urlParams.get('processoId');

    if (!processoId) {
        alert('ID do Processo não fornecido.');
        window.history.back();
        return;
    }

    carregarProcesso(processoId);
});

async function carregarProcesso(processoId) {
    try {
        const response = await fetch(`${API_BASE_URL}/onboarding/processo/${processoId}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        if (!response.ok) throw new Error('Falha ao carregar processo de admissão.');

        const processo = await response.json();

        document.getElementById('nomeVaga').innerText = processo.vaga.nomeVaga;
        document.getElementById('instrucoesGerais').innerText = processo.instrucoesGerais || 'Nenhuma instrução especial fornecida.';

        // Anexos
        const anexosContainer = document.getElementById('anexosContainer');
        anexosContainer.innerHTML = '';
        if (!processo.anexosInstrucoes || processo.anexosInstrucoes.length === 0) {
            anexosContainer.innerHTML = '<p class="text-white-50 small">Nenhum anexo fornecido.</p>';
        } else {
            processo.anexosInstrucoes.forEach(anexo => {
                anexosContainer.innerHTML += `
                    <div class="mb-2">
                        <i class="zmdi zmdi-file-text text-info mr-2"></i>
                        <strong>${anexo.tituloGeral}</strong>:
                        <a href="${API_BASE_URL}/files/${anexo.caminhoArquivo}" target="_blank" class="ml-2 btn btn-sm btn-outline-light">Baixar / Visualizar</a>
                    </div>
                `;
            });
        }

        // Documentos Exigidos
        const docsContainer = document.getElementById('documentosContainer');
        docsContainer.innerHTML = '';

        if (!processo.documentosExigidos || processo.documentosExigidos.length === 0) {
            docsContainer.innerHTML = '<p class="text-white-50">Nenhum documento exigido.</p>';
        } else {
            processo.documentosExigidos.forEach(doc => {
                let statusIcon = '';
                let statusClass = '';
                let statusText = '';
                let uploadForm = '';

                switch (doc.status) {
                    case 'PENDENTE':
                        statusIcon = 'zmdi-time'; statusClass = 'status-pendente'; statusText = 'Pendente de Envio';
                        uploadForm = criarFormUpload(doc.id);
                        break;
                    case 'ENVIADO':
                        statusIcon = 'zmdi-check-circle'; statusClass = 'status-enviado'; statusText = 'Enviado (Em Análise)';
                        break;
                    case 'APROVADO':
                        statusIcon = 'zmdi-shield-check'; statusClass = 'status-aprovado'; statusText = 'Aprovado';
                        break;
                    case 'REJEITADO':
                        statusIcon = 'zmdi-close-circle'; statusClass = 'status-rejeitado'; statusText = 'Rejeitado';
                        uploadForm = `
                            <p class="text-danger small mt-2"><strong>Motivo da rejeição:</strong> ${doc.observacaoRecrutador}</p>
                            ${criarFormUpload(doc.id)}
                        `;
                        break;
                }

                const docDiv = document.createElement('div');
                docDiv.className = 'doc-card';
                docDiv.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-1 text-white">${doc.nomeDocumento}</h6>
                            <small class="text-white-50">Formato exigido: ${doc.formatoEsperado}</small>
                        </div>
                        <div class="${statusClass} text-right">
                            <i class="zmdi ${statusIcon} mr-1"></i> ${statusText}
                        </div>
                    </div>
                    ${uploadForm}
                `;
                docsContainer.appendChild(docDiv);
            });
        }

    } catch (error) {
        console.error(error);
        alert('Erro ao carregar a página.');
    }
}

function criarFormUpload(docId) {
    return `
        <div class="mt-3">
            <form onsubmit="enviarDocumento(event, ${docId})" class="form-inline">
                <input type="file" class="form-control-file form-control-sm mr-2" id="file-${docId}" required>
                <button type="submit" class="btn btn-sm btn-primary">Enviar</button>
            </form>
        </div>
    `;
}

async function enviarDocumento(event, docId) {
    event.preventDefault();
    const btn = event.target.querySelector('button');
    btn.disabled = true;
    btn.innerText = 'Enviando...';

    const fileInput = document.getElementById(`file-${docId}`);
    if (fileInput.files.length === 0) {
        alert('Selecione um arquivo.');
        btn.disabled = false;
        btn.innerText = 'Enviar';
        return;
    }

    const formData = new FormData();
    formData.append('arquivo', fileInput.files[0]);

    try {
        const response = await fetch(`${API_BASE_URL}/onboarding/documento/${docId}/enviar`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: formData
        });

        if (response.ok) {
            alert('Documento enviado com sucesso!');
            location.reload(); // Recarrega para atualizar os status
        } else {
            const err = await response.json();
            alert('Erro: ' + (err.message || 'Falha ao enviar documento.'));
            btn.disabled = false;
            btn.innerText = 'Enviar';
        }
    } catch (error) {
        console.error(error);
        alert('Erro de conexão ao enviar documento.');
        btn.disabled = false;
        btn.innerText = 'Enviar';
    }
}