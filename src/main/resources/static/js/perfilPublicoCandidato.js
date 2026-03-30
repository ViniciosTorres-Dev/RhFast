const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const candidatoId = urlParams.get('id');

    if (!candidatoId) {
        alert('ID do candidato não fornecido.');
        window.history.back();
        return;
    }

    carregarPerfil(candidatoId);
});

async function carregarPerfil(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/candidatos/${id}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        if (!response.ok) {
            throw new Error('Falha ao carregar perfil do candidato.');
        }

        const candidato = await response.json();

        document.getElementById('nomeCandidato').innerText = `${candidato.nome} ${candidato.sobrenome}`;
        document.getElementById('emailCandidato').innerText = candidato.email;
        document.getElementById('telefoneCandidato').innerText = candidato.numeroTelefone || 'Não informado';
        document.getElementById('localCandidato').innerText = `${candidato.cidade}, ${candidato.estado}`;

        // Carregar currículos
        const curriculosContainer = document.getElementById('curriculosContainer');
        curriculosContainer.innerHTML = '';

        if (candidato.curriculos && candidato.curriculos.length > 0) {
            candidato.curriculos.forEach(curriculo => {
                const urlArquivo = `${API_BASE_URL}/files/${curriculo.urlCurriculo}`;
                const extensao = curriculo.nomeCurriculo.split('.').pop().toLowerCase();
                let previewHtml = '';

                // Verifica a extensão para decidir como renderizar o preview
                if (['jpg', 'jpeg', 'png', 'gif'].includes(extensao)) {
                    previewHtml = `<img src="${urlArquivo}" alt="Currículo" style="max-width: 100%; height: auto; border-radius: 5px; margin-top: 10px;">`;
                } else if (extensao === 'pdf') {
                    previewHtml = `<iframe src="${urlArquivo}" width="100%" height="500px" style="border: none; margin-top: 10px;"></iframe>`;
                } else {
                    previewHtml = `<p class="text-white-50 small mt-2">Preview não disponível para este formato. Clique no botão de download.</p>`;
                }

                const div = document.createElement('div');
                div.className = 'mb-4 p-3 border border-secondary rounded bg-dark-2';
                div.innerHTML = `
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <div style="cursor: pointer;" onclick="togglePreview('preview-${curriculo.id}')" title="Clique para expandir/recolher o documento">
                            <i class="zmdi zmdi-file-text text-info mr-2"></i>
                            <strong class="text-white" style="text-decoration: underline; text-underline-offset: 3px;">${curriculo.nomeCurriculo}</strong>
                            <small class="text-muted ml-2">(Clique para expandir)</small>
                        </div>
                        <a href="${urlArquivo}" target="_blank" class="btn btn-sm btn-outline-info">
                            <i class="zmdi zmdi-download"></i> Baixar
                        </a>
                    </div>
                    <div id="preview-${curriculo.id}" style="display: none;">
                        ${previewHtml}
                    </div>
                `;
                curriculosContainer.appendChild(div);
            });
        } else {
            curriculosContainer.innerHTML = '<p class="text-muted">Nenhum currículo cadastrado.</p>';
        }

    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('info-candidato').innerHTML = '<p class="text-danger text-center">Não foi possível carregar as informações do candidato.</p>';
        document.getElementById('nomeCandidato').innerText = "Candidato não encontrado";
    }
}

// Função para mostrar/esconder o iframe ou a imagem
function togglePreview(elementId) {
    const el = document.getElementById(elementId);
    if (el.style.display === 'none') {
        el.style.display = 'block';
    } else {
        el.style.display = 'none';
    }
}
