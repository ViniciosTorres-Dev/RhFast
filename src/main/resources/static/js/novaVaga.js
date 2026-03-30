const API_BASE_URL = 'http://localhost:8080/api';
let questaoIndexModal = 0;
let editandoTesteId = null;
let testesTemporarios = []; // Armazena novos testes antes de salvar a vaga

document.addEventListener('DOMContentLoaded', () => {
    testesTemporarios = [];
    $('#cep').mask('00000-000');
    loadTestes();

    document.getElementById('cep').addEventListener('blur', handleCepBlur);
    document.getElementById('novaVagaForm').addEventListener('submit', criarVaga);
    document.getElementById('btnSalvarTesteModal').addEventListener('click', salvarTestePeloModal);

    $('#modalCriarTeste').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget);
        const testeId = button.data('teste-id');
        if (testeId) {
            editandoTesteId = testeId;
            abrirModalParaEdicao(testeId);
        } else {
            editandoTesteId = null;
            resetarModalTeste();
        }
    });
});

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        testesTemporarios = [];
        loadTestes();
    }
});

// --- Lógica de CEP ---
function handleCepBlur(event) {
    const cep = event.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
        buscarEnderecoPorCep(cep);
    }
}

function buscarEnderecoPorCep(cep) {
    const statusMessage = document.getElementById('cepStatus');
    statusMessage.textContent = 'Buscando CEP...';
    statusMessage.className = 'text-info small';

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
            if (!data.erro) {
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('estado').value = data.uf;
                statusMessage.textContent = 'Endereço preenchido!';
                statusMessage.className = 'text-success small';
            } else {
                statusMessage.textContent = 'CEP não encontrado.';
                statusMessage.className = 'text-danger small';
            }
        })
        .catch(err => {
            console.error("Erro ao buscar CEP:", err);
            statusMessage.textContent = 'Não foi possível buscar o CEP.';
            statusMessage.className = 'text-danger small';
        });
}

// --- Lógica Principal da Página ---

async function loadTestes() {
    const container = document.getElementById('testesContainer');
    try {
        const response = await fetch(`${API_BASE_URL}/testes`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (!response.ok) throw new Error('Falha ao carregar testes');

        const testesSalvos = await response.json();
        container.innerHTML = '';

        const todosTestes = [...testesSalvos, ...testesTemporarios];

        if (todosTestes.length === 0) {
            container.innerHTML = '<p class="text-white-50">Nenhum teste cadastrado. Crie um no botão acima.</p>';
            return;
        }

        todosTestes.forEach(teste => {
            const isTemp = !!teste.tempId;
            const id = isTemp ? teste.tempId : teste.id;
            const div = document.createElement('div');
            div.className = 'form-check d-flex justify-content-between align-items-center';
            div.innerHTML = `
                <div>
                    <input class="form-check-input" type="checkbox" value="${id}" id="teste-${id}" data-is-temp="${isTemp}" checked>
                    <label class="form-check-label" for="teste-${id}">
                        ${teste.titulo} <span class="text-muted small">- ${isTemp ? 'Novo' : teste.tipo}</span>
                    </label>
                </div>
                <button type="button" class="btn btn-sm btn-outline-light" onclick="removerTeste('${id}', ${isTemp})">
                    <i class="zmdi zmdi-delete"></i>
                </button>
            `;
            container.appendChild(div);
        });

    } catch (error) {
        console.error('Erro:', error);
        container.innerHTML = '<p class="text-danger">Não foi possível carregar os testes.</p>';
    }
}

function removerTeste(id, isTemp) {
    if (isTemp) {
        testesTemporarios = testesTemporarios.filter(t => t.tempId !== id);
        loadTestes(); // Recarrega a lista para refletir a remoção
    } else {
        // Para um teste já salvo, apenas desmarca o checkbox
        const checkbox = document.getElementById(`teste-${id}`);
        if (checkbox) {
            checkbox.checked = false;
        }
    }
}

async function criarVaga(event) {
    event.preventDefault();
    const btn = event.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = 'Publicando...';

    const recrutadorId = localStorage.getItem('recrutadorId');
    let empresaId = null;
    try {
        const recResponse = await fetch(`${API_BASE_URL}/recrutadores/${recrutadorId}`);
        if(recResponse.ok) {
            const recrutador = await recResponse.json();
            empresaId = recrutador.empresa.id;
        } else {
            throw new Error('Recrutador não encontrado para associar empresa.');
        }
    } catch(e) {
        alert(e.message);
        btn.disabled = false;
        btn.innerHTML = '<i class="zmdi zmdi-plus"></i> Publicar Vaga';
        return;
    }

    const testesExistentesIds = [];
    document.querySelectorAll('#testesContainer input[type="checkbox"]:checked').forEach(checkbox => {
        if (checkbox.dataset.isTemp === 'false') {
            testesExistentesIds.push(parseInt(checkbox.value));
        }
    });

    const vagaData = {
        nomeVaga: document.getElementById('nomeVaga').value,
        setorVaga: document.getElementById('setorVaga').value,
        salario: parseFloat(document.getElementById('salario').value),
        modalidade: document.getElementById('modalidade').value,
        cep: document.getElementById('cep').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        pais: document.getElementById('pais').value,
        nivelExperiencia: document.getElementById('nivelExperiencia').value,
        descricaoVaga: document.getElementById('descricaoVaga').value,
        recrutadorId: parseInt(recrutadorId),
        empresaId: empresaId,
        testesIds: testesExistentesIds,
        novosTestes: testesTemporarios
    };

    try {
        const response = await fetch(`${API_BASE_URL}/vagas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: JSON.stringify(vagaData)
        });

        if (response.ok) {
            alert('Vaga criada com sucesso!');
            window.location.href = 'mainRecrutador.html';
        } else {
            const err = await response.json();
            alert('Erro ao criar vaga: ' + (err.message || 'Verifique os dados.'));
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão ao criar vaga.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="zmdi zmdi-plus"></i> Publicar Vaga';
    }
}

// --- Lógica do Modal ---

function salvarTestePeloModal() {
    const questoes = [];
    document.querySelectorAll('#questoesContainerModal .card').forEach((card) => {
        const questao = {
            texto: card.querySelector('[name="textoQuestao"]').value,
            tipoResposta: card.querySelector('[name="tipoResposta"]').value,
            opcoesResposta: [],
            respostasCorretas: []
        };
        if (questao.tipoResposta === 'MULTIPLA_ESCOLHA') {
            card.querySelectorAll('[name="opcoes"] .input-group').forEach((opcaoEl, idx) => {
                questao.opcoesResposta.push(opcaoEl.querySelector('[name="textoOpcao"]').value);
                if (opcaoEl.querySelector(`[name^="correta-"]`).checked) {
                    questao.respostasCorretas.push(idx);
                }
            });
        }
        questoes.push(questao);
    });

    const novoTeste = {
        tempId: `temp-${Date.now()}`, // ID temporário
        titulo: document.getElementById('tituloTesteModal').value,
        tipo: document.getElementById('tipoTesteModal').value,
        descricao: document.getElementById('descricaoTesteModal').value,
        tempoRecomendadoMinutos: parseInt(document.getElementById('tempoTesteModal').value) || 30,
        perguntas: questoes
    };

    testesTemporarios.push(novoTeste);
    $('#modalCriarTeste').modal('hide');
    loadTestes(); // Atualiza a UI com o teste temporário
}

// Funções de manipulação do modal (adicionarQuestaoModal, etc.) permanecem as mesmas
function resetarModalTeste() {
    document.getElementById('formCriarTesteModal').reset();
    document.getElementById('questoesContainerModal').innerHTML = '';
    document.querySelector('#modalCriarTeste .modal-title').textContent = 'Criar Novo Teste';
    questaoIndexModal = 0;
}

function adicionarQuestaoModal(pergunta = null) {
    const container = document.getElementById('questoesContainerModal');
    const questaoId = `q-modal-${questaoIndexModal}`;
    const div = document.createElement('div');
    div.className = 'card bg-dark-2 mb-3';
    div.id = questaoId;

    const texto = pergunta ? pergunta.texto : '';
    const tipo = pergunta ? pergunta.tipoResposta : 'TEXTO';

    div.innerHTML = `
        <div class="card-body">
            <div class="form-group"><label>Texto da Questão ${questaoIndexModal + 1}</label><input type="text" class="form-control" name="textoQuestao" required value="${texto}"></div>
            <div class="form-group"><label>Tipo de Resposta</label><select class="form-control" name="tipoResposta" onchange="toggleOpcoes('${questaoId}', this.value)"><option value="TEXTO" ${tipo === 'TEXTO' ? 'selected' : ''}>Texto</option><option value="MULTIPLA_ESCOLHA" ${tipo === 'MULTIPLA_ESCOLHA' ? 'selected' : ''}>Múltipla Escolha</option></select></div>
            <div name="opcoesContainer" style="display:${tipo === 'MULTIPLA_ESCOLHA' ? 'block' : 'none'};"><label>Opções de Resposta</label><div name="opcoes"></div><button type="button" class="btn btn-sm btn-outline-info mt-2" onclick="adicionarOpcaoModal('${questaoId}')">Adicionar Opção</button></div>
            <button type="button" class="btn btn-sm btn-danger mt-3" onclick="removerElemento('${questaoId}')">Remover Questão</button>
        </div>
    `;
    container.appendChild(div);

    if (pergunta && pergunta.tipoResposta === 'MULTIPLA_ESCOLHA') {
        pergunta.opcoesResposta.forEach((opcao, i) => {
            const isCorreta = pergunta.respostasCorretas.includes(i);
            adicionarOpcaoModal(questaoId, opcao, isCorreta);
        });
    }

    questaoIndexModal++;
}

function toggleOpcoes(questaoId, tipo) {
    const opcoesContainer = document.querySelector(`#${questaoId} [name="opcoesContainer"]`);
    opcoesContainer.style.display = tipo === 'MULTIPLA_ESCOLHA' ? 'block' : 'none';
}

function adicionarOpcaoModal(questaoId, texto = '', isCorreta = false) {
    const opcoesDiv = document.querySelector(`#${questaoId} [name="opcoes"]`);
    const index = opcoesDiv.children.length;
    const div = document.createElement('div');
    div.className = 'input-group mb-2';
    div.innerHTML = `
        <div class="input-group-prepend"><div class="input-group-text"><input type="checkbox" name="correta-${questaoId}" value="${index}" ${isCorreta ? 'checked' : ''}></div></div>
        <input type="text" class="form-control" name="textoOpcao" placeholder="Texto da opção ${index + 1}" value="${texto}">
        <div class="input-group-append"><button class="btn btn-outline-danger" type="button" onclick="this.parentElement.parentElement.remove()">X</button></div>
    `;
    opcoesDiv.appendChild(div);
}

function removerElemento(id) {
    document.getElementById(id)?.remove();
}
