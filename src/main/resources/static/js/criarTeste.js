const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const vagaId = urlParams.get('vagaId');

    if (!vagaId) {
        alert('Vaga não especificada!');
        window.location.href = 'mainRecrutador.html';
        return;
    }

    document.getElementById('vagaId').value = vagaId;

    document.getElementById('formCriarTeste').addEventListener('submit', function(e) {
        e.preventDefault();
        salvarTeste(vagaId);
    });
});

let perguntaCount = 0;

function adicionarQuestao() {
    perguntaCount++;
    const container = document.getElementById('questoesContainer');
    const questaoHtml = `
        <div class="card mb-3 border-light" id="pergunta-${perguntaCount}">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="card-title m-0 text-white"><i class="zmdi zmdi-help-outline mr-2"></i>Questão ${perguntaCount}</h5>
                    <button type="button" class="btn btn-danger btn-sm" onclick="removerQuestao(${perguntaCount})" title="Remover Questão"><i class="zmdi zmdi-delete"></i></button>
                </div>
                <div class="form-group">
                    <label>Enunciado da Pergunta</label>
                    <textarea class="form-control" name="perguntaTexto" required rows="3" placeholder="Escreva a pergunta aqui..."></textarea>
                </div>
                <div class="row">
                    <div class="col-md-6">
                        <div class="form-group">
                            <label>Tipo de Resposta</label>
                            <select class="form-control" name="tipoResposta" onchange="mudarTipoResposta(this, ${perguntaCount})">
                                <option value="TEXTO">Texto Livre</option>
                                <option value="MULTIPLA_ESCOLHA">Múltipla Escolha</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="form-group" id="resposta-correta-texto-${perguntaCount}">
                    <label>Resposta Esperada / Gabarito (Opcional)</label>
                    <textarea class="form-control" name="respostaCorretaTexto" rows="2" placeholder="O que você espera que o candidato responda?"></textarea>
                </div>

                <div id="opcoes-container-${perguntaCount}" style="display: none;">
                    <label>Opções de Resposta</label>
                    <p class="text-muted small mb-2">Marque o checkbox das opções que são consideradas corretas.</p>
                    <div id="lista-opcoes-${perguntaCount}"></div>
                </div>
                 <div class="form-group mt-2" id="add-opcao-btn-container-${perguntaCount}" style="display: none;">
                    <button type="button" class="btn btn-info btn-sm" onclick="adicionarOpcao(${perguntaCount})"><i class="zmdi zmdi-plus"></i> Adicionar Opção</button>
                </div>

                <div class="form-group mt-3 pt-3 border-top border-light">
                    <label>Anexar Imagem ou PDF (Opcional)</label>
                    <input type="file" class="form-control-file" name="perguntaArquivo" accept=".jpg,.jpeg,.png,.pdf">
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', questaoHtml);
}

function mudarTipoResposta(select, id) {
    const opcoesContainer = document.getElementById(`opcoes-container-${id}`);
    const listaOpcoes = document.getElementById(`lista-opcoes-${id}`);
    const addOpcaoBtnContainer = document.getElementById(`add-opcao-btn-container-${id}`);
    const respostaTextoContainer = document.getElementById(`resposta-correta-texto-${id}`);

    if (select.value === 'MULTIPLA_ESCOLHA') {
        opcoesContainer.style.display = 'block';
        addOpcaoBtnContainer.style.display = 'block';
        respostaTextoContainer.style.display = 'none';
        if (listaOpcoes.children.length === 0) { // Adiciona a primeira opção
            adicionarOpcao(id);
            adicionarOpcao(id); // Adiciona pelo menos 2 para múltipla escolha
        }
    } else {
        opcoesContainer.style.display = 'none';
        addOpcaoBtnContainer.style.display = 'none';
        respostaTextoContainer.style.display = 'block';
        listaOpcoes.innerHTML = ''; // Limpa as opções
    }
}

function adicionarOpcao(perguntaId) {
    const listaOpcoes = document.getElementById(`lista-opcoes-${perguntaId}`);
    const opcaoIndex = Date.now(); // Usa timestamp para ID único de opção

    // Obter quantidade atual para visual
    const numAtual = listaOpcoes.children.length + 1;

    const opcaoHtml = `
        <div class="input-group mb-2" id="opcao-${perguntaId}-${opcaoIndex}">
            <div class="input-group-prepend">
                <div class="input-group-text bg-dark border-secondary">
                    <input type="checkbox" name="respostaCorreta-${perguntaId}" value="${opcaoIndex}" title="Marcar como correta" style="width: 16px; height: 16px; cursor: pointer;">
                </div>
            </div>
            <input type="text" class="form-control border-secondary" name="opcaoTexto-${perguntaId}" data-opcao-id="${opcaoIndex}" placeholder="Opção ${numAtual}" required>
            <div class="input-group-append">
                <button class="btn btn-outline-danger" type="button" onclick="removerOpcao(${perguntaId}, ${opcaoIndex})" title="Remover Opção"><i class="zmdi zmdi-close"></i></button>
            </div>
        </div>
    `;
    listaOpcoes.insertAdjacentHTML('beforeend', opcaoHtml);
}

function removerOpcao(perguntaId, opcaoIndex) {
    const opcaoDiv = document.getElementById(`opcao-${perguntaId}-${opcaoIndex}`);
    if (opcaoDiv) {
        const listaOpcoes = document.getElementById(`lista-opcoes-${perguntaId}`);
        if (listaOpcoes.children.length <= 2) {
             alert('A questão de múltipla escolha deve ter pelo menos 2 opções.');
             return;
        }

        opcaoDiv.remove();

        // Atualizar placeholders
        Array.from(listaOpcoes.children).forEach((child, index) => {
            const input = child.querySelector('input[type="text"]');
            if (input) input.placeholder = `Opção ${index + 1}`;
        });
    }
}


function removerQuestao(id) {
    if(confirm('Tem certeza que deseja remover esta questão?')) {
        const questaoDiv = document.getElementById(`pergunta-${id}`);
        questaoDiv.remove();
    }
}

function salvarTeste(vagaId) {
    const questaoElements = document.querySelectorAll('[id^="pergunta-"]');

    if (questaoElements.length === 0) {
        alert('Por favor, adicione pelo menos uma questão ao teste.');
        return;
    }

    const form = document.getElementById('formCriarTeste');
    const formData = new FormData();

    const titulo = document.getElementById('tituloTeste').value;
    const descricao = document.getElementById('descricaoTeste').value;

    const testeData = {
        titulo: titulo,
        descricao: descricao,
        perguntas: []
    };

    let fileCounter = 0;
    let validacaoOk = true;

    questaoElements.forEach((el, index) => {
        const perguntaId = el.id.split('-')[1];
        const texto = el.querySelector('[name="perguntaTexto"]').value;
        const tipoResp = el.querySelector('[name="tipoResposta"]').value;
        const arquivoInput = el.querySelector('[name="perguntaArquivo"]');
        const arquivo = arquivoInput.files[0];

        const pergunta = {
            texto: texto,
            tipoResposta: tipoResp,
            opcoesResposta: [],
            respostasCorretas: [],
            respostaCorreta: ''
        };

        if (tipoResp === 'MULTIPLA_ESCOLHA') {
            const listaOpcoes = document.getElementById(`lista-opcoes-${perguntaId}`);

            if (listaOpcoes.children.length < 2) {
                alert(`A Questão ${index + 1} precisa ter pelo menos 2 opções de resposta.`);
                validacaoOk = false;
                return;
            }

            // Map original unique IDs to array indices (0, 1, 2...)
            const idToIndexMap = {};
            let currentIndex = 0;

            const opcoesInputs = listaOpcoes.querySelectorAll('input[type="text"]');
            opcoesInputs.forEach(input => {
                pergunta.opcoesResposta.push(input.value);
                const originalId = input.getAttribute('data-opcao-id');
                idToIndexMap[originalId] = currentIndex++;
            });

            const respostasCorretasChecks = listaOpcoes.querySelectorAll(`input[type="checkbox"]:checked`);
            respostasCorretasChecks.forEach(check => {
                const originalId = check.value;
                const mappedIndex = idToIndexMap[originalId];
                if (mappedIndex !== undefined) {
                    pergunta.respostasCorretas.push(mappedIndex);
                }
            });

            if (pergunta.respostasCorretas.length === 0) {
                 alert(`A Questão ${index + 1} precisa ter pelo menos uma resposta marcada como correta.`);
                 validacaoOk = false;
                 return;
            }

        } else {
            const respCorretaTexto = el.querySelector('[name="respostaCorretaTexto"]');
            if (respCorretaTexto) {
                pergunta.respostaCorreta = respCorretaTexto.value;
            }
        }

        if (arquivo) {
            const fileName = `file${fileCounter++}`;
            formData.append(fileName, arquivo);
            pergunta.filePath = fileName; // Placeholder for backend to match
        }

        testeData.perguntas.push(pergunta);
    });

    if (!validacaoOk) return;

    formData.append('teste', new Blob([JSON.stringify(testeData)], { type: 'application/json' }));

    fetch(`${API_BASE_URL}/testes/com-arquivos?vagaId=${vagaId}`, { // URL corrigida
        method: 'POST',
        body: formData,
         headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Teste criado com sucesso!');
            window.location.href = `detalhesVagaRecrutador.html?id=${vagaId}`;
        } else {
            response.text().then(text => alert('Erro ao criar teste: ' + text));
        }
    })
    .catch(error => console.error('Erro:', error));
}
