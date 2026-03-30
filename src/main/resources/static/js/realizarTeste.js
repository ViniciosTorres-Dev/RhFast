const API_BASE_URL = 'http://localhost:8080/api';

let testeData = null;
let respostasUsuario = {};
let questaoAtualIndex = 0;
let tempoTotalSegundos = 0;
let timerInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const testeId = urlParams.get('testeId');
    const candidatoId = localStorage.getItem('candidatoId');

    if (!testeId || !candidatoId) {
        alert('ID do Teste ou do Candidato não fornecido!');
        window.history.back();
        return;
    }

    verificarStatusEProsseguir(testeId, candidatoId);
});

async function verificarStatusEProsseguir(testeId, candidatoId) {
    try {
        const statusResponse = await fetch(`${API_BASE_URL}/testes/${testeId}/candidato/${candidatoId}/status`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (!statusResponse.ok) throw new Error('Falha ao verificar status do teste.');

        const statusData = await statusResponse.json();

        if (statusData.concluido) {
            alert('Você já concluiu este teste. Você será redirecionado.');
            window.history.back();
        } else {
            carregarTeste(testeId);
        }
    } catch (error) {
        console.error('Erro na verificação de status:', error);
        document.getElementById('tela-introducao').innerHTML = `<div class="card-body text-center"><p class="text-danger">${error.message}</p></div>`;
    }
}

async function carregarTeste(testeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/testes/${testeId}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (!response.ok) throw new Error('Falha ao carregar o teste.');

        testeData = await response.json();

        document.getElementById('teste-titulo-intro').innerText = testeData.titulo;
        document.getElementById('teste-descricao-intro').innerText = testeData.descricao;
        document.getElementById('teste-titulo').innerText = testeData.titulo;
        document.getElementById('teste-descricao').innerText = testeData.descricao;

    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('tela-introducao').innerHTML = `<div class="card-body text-center"><p class="text-danger">${error.message}</p></div>`;
    }
}

function iniciarExame() {
    document.getElementById('tela-introducao').style.display = 'none';
    document.getElementById('tela-exame').style.display = 'block';

    if (testeData && testeData.perguntas && testeData.perguntas.length > 0) {
        tempoTotalSegundos = testeData.tempoRecomendadoMinutos * 60 || 30 * 60;
        mostrarQuestao(questaoAtualIndex);
        iniciarTimer();
    } else {
        document.getElementById('pergunta-container').innerHTML = '<p class="text-center">Este teste não contém perguntas.</p>';
        document.getElementById('btn-proxima').disabled = true;
    }
}

function mostrarQuestao(index) {
    const container = document.getElementById('pergunta-container');
    const pergunta = testeData.perguntas[index];

    // Lógica da Imagem
    const imgContainer = document.getElementById('imagem-pergunta-container');
    const imgEl = document.getElementById('pergunta-imagem');
    if (pergunta.filePath) {
        imgEl.src = `${API_BASE_URL}/files/${pergunta.filePath}`;
        imgContainer.style.display = 'block';
    } else {
        imgContainer.style.display = 'none';
    }

    let conteudo = '';
    if (pergunta.tipoResposta === 'MULTIPLA_ESCOLHA') {
        const opcoesHtml = pergunta.opcoesResposta.map((opcao, i) => {
            const respostaSalva = respostasUsuario[pergunta.id] || [];
            const isChecked = respostaSalva.includes(i);
            return `<div><label class="opcao-label ${isChecked ? 'selected' : ''}"><input type="checkbox" name="opcao" value="${i}" ${isChecked ? 'checked' : ''} onchange="salvarResposta(${pergunta.id}, ${i}, true)" class="d-none">${opcao}</label></div>`;
        }).join('');
        conteudo = `<h5>${index + 1}. ${pergunta.texto}</h5>${opcoesHtml}`;
    } else {
        const respostaSalva = respostasUsuario[pergunta.id] || '';
        conteudo = `<h5>${index + 1}. ${pergunta.texto}</h5><textarea class="form-control" rows="8" onkeyup="salvarResposta(${pergunta.id}, this.value, false)">${respostaSalva}</textarea>`;
    }

    container.innerHTML = conteudo;
    atualizarBotoesNavegacao();
    atualizarProgressBar();
}

function salvarResposta(perguntaId, valor, isMultiplaEscolha) {
    if (isMultiplaEscolha) {
        const selecionados = Array.from(document.querySelectorAll(`input[name="opcao"]:checked`)).map(cb => parseInt(cb.value));
        respostasUsuario[perguntaId] = selecionados;
    } else {
        respostasUsuario[perguntaId] = valor;
    }
    const labels = document.querySelectorAll('.opcao-label');
    labels.forEach(label => {
        const input = label.querySelector('input');
        if (input && input.checked) {
            label.classList.add('selected');
        } else {
            label.classList.remove('selected');
        }
    });
}

function mostrarProximaQuestao() {
    if (questaoAtualIndex < testeData.perguntas.length - 1) {
        questaoAtualIndex++;
        mostrarQuestao(questaoAtualIndex);
    }
}

function mostrarQuestaoAnterior() {
    if (questaoAtualIndex > 0) {
        questaoAtualIndex--;
        mostrarQuestao(questaoAtualIndex);
    }
}

function atualizarBotoesNavegacao() {
    const totalPerguntas = testeData.perguntas.length;
    document.getElementById('btn-anterior').disabled = questaoAtualIndex === 0;
    document.getElementById('btn-proxima').style.display = questaoAtualIndex === totalPerguntas - 1 ? 'none' : 'inline-block';
    document.getElementById('btn-finalizar').style.display = questaoAtualIndex === totalPerguntas - 1 ? 'inline-block' : 'none';
}

function atualizarProgressBar() {
    const progresso = ((questaoAtualIndex + 1) / testeData.perguntas.length) * 100;
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${progresso}%`;
    progressBar.setAttribute('aria-valuenow', progresso);
}

function iniciarTimer() {
    const timerEl = document.getElementById('timer');
    timerInterval = setInterval(() => {
        const minutos = Math.floor(tempoTotalSegundos / 60);
        const segundos = tempoTotalSegundos % 60;
        timerEl.textContent = `Tempo Restante: ${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;

        if (tempoTotalSegundos > 0) {
            tempoTotalSegundos--;
        } else {
            clearInterval(timerInterval);
            alert('O tempo para realizar o teste acabou!');
            finalizarTeste(true);
        }
    }, 1000);
}

function finalizarTeste(tempoEsgotado = false) {
    clearInterval(timerInterval);

    if (!tempoEsgotado && !confirm('Tem certeza que deseja finalizar e submeter o teste?')) {
        iniciarTimer();
        return;
    }

    const submissao = {
        testeId: testeData.id,
        candidatoId: localStorage.getItem('candidatoId'),
        respostas: Object.entries(respostasUsuario).map(([perguntaId, resposta]) => ({
            perguntaId: parseInt(perguntaId),
            resposta: resposta
        }))
    };

    fetch(`${API_BASE_URL}/testes/submeter`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(submissao)
    })
    .then(async response => {
        if (response.ok) {
            alert('Teste enviado com sucesso!');
            window.location.href = 'minhasCandidaturas.html';
        } else {
            const error = await response.json();
            alert('Erro ao enviar o teste: ' + (error.message || 'Erro desconhecido'));
            iniciarTimer();
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro de conexão ao enviar o teste.');
        iniciarTimer();
    });
}
