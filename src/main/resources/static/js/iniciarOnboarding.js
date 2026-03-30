const API_BASE_URL = 'http://localhost:8080/api';
let docIndex = 0;
let anexoIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const candidatoId = urlParams.get('candidatoId');
    const vagaId = urlParams.get('vagaId');
    const nomeCandidato = urlParams.get('nome');

    if (!candidatoId || !vagaId) {
        alert('Dados insuficientes para iniciar o onboarding.');
        window.history.back();
        return;
    }

    document.getElementById('candidatoId').value = candidatoId;
    document.getElementById('vagaId').value = vagaId;
    if (nomeCandidato) {
        document.getElementById('nomeCandidato').innerText = decodeURIComponent(nomeCandidato);
    }

    adicionarDocumento('RG Frente e Verso', 'PDF ou JPG');
    adicionarDocumento('Comprovante de Residência', 'PDF ou JPG');
    adicionarDocumento('Atestado de Saúde Ocupacional (ASO)', 'PDF');
});

function adicionarDocumento(nomePadrao = '', formatoPadrao = '') {
    const container = document.getElementById('documentosContainer');
    const div = document.createElement('div');
    div.className = 'form-row mb-2 border border-secondary p-2 rounded';
    div.id = `doc-${docIndex}`;

    div.innerHTML = `
        <div class="col-md-5">
            <input type="text" class="form-control" name="docNome" placeholder="Ex: Cópia do RG" value="${nomePadrao}" required>
        </div>
        <div class="col-md-5">
            <input type="text" class="form-control" name="docFormato" placeholder="Ex: PDF, JPG" value="${formatoPadrao}" required>
        </div>
        <div class="col-md-2">
            <button type="button" class="btn btn-danger btn-block" onclick="removerElemento('doc-${docIndex}')"><i class="zmdi zmdi-delete"></i></button>
        </div>
    `;
    container.appendChild(div);
    docIndex++;
}

function adicionarAnexo() {
    const container = document.getElementById('anexosContainer');
    const div = document.createElement('div');
    div.className = 'form-row mb-2 border border-secondary p-2 rounded';
    div.id = `anexo-${anexoIndex}`;

    div.innerHTML = `
        <div class="col-md-5">
            <input type="text" class="form-control" name="anexoTitulo" placeholder="Ex: Manual de Integração" required>
        </div>
        <div class="col-md-5">
            <input type="file" class="form-control-file" name="anexoArquivo" required>
        </div>
        <div class="col-md-2">
            <button type="button" class="btn btn-danger btn-block" onclick="removerElemento('anexo-${anexoIndex}')"><i class="zmdi zmdi-delete"></i></button>
        </div>
    `;
    container.appendChild(div);
    anexoIndex++;
}

function removerElemento(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

document.getElementById('formOnboarding').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnSubmit = e.target.querySelector('button[type="submit"]');
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = 'Enviando...';

    const vagaId = document.getElementById('vagaId').value;
    const candidatoId = document.getElementById('candidatoId').value;
    const instrucoesGerais = document.getElementById('instrucoesGerais').value;

    const documentos = [];
    document.querySelectorAll('#documentosContainer .form-row').forEach(row => {
        documentos.push({
            nomeDocumento: row.querySelector('input[name="docNome"]').value,
            formatoEsperado: row.querySelector('input[name="docFormato"]').value
        });
    });

    const dto = { vagaId, candidatoId, instrucoesGerais, documentosExigidos: documentos };

    const formData = new FormData();
    formData.append('dados', JSON.stringify(dto));

    // Anexos
    document.querySelectorAll('#anexosContainer .form-row').forEach(row => {
        const titulo = row.querySelector('input[name="anexoTitulo"]').value;
        const fileInput = row.querySelector('input[name="anexoArquivo"]');
        if (fileInput.files.length > 0) {
            formData.append(titulo, fileInput.files[0]);
        }
    });

    try {
        const response = await fetch(`${API_BASE_URL}/onboarding/iniciar`, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: formData
        });

        if (response.ok) {
            alert('Processo de admissão iniciado com sucesso! O candidato será notificado.');
            window.location.href = 'detalhesVagaRecrutador.html?id=' + vagaId;
        } else {
            const err = await response.json();
            alert('Erro: ' + (err.message || 'Falha ao iniciar processo.'));
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor.');
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = '<i class="zmdi zmdi-mail-send"></i> Enviar Solicitação ao Candidato';
    }
});