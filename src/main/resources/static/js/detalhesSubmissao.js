const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const submissaoId = urlParams.get('submissaoId');

    if (!submissaoId) {
        alert('ID da submissão não fornecido!');
        window.history.back();
        return;
    }

    carregarDetalhesSubmissao(submissaoId);
});

async function carregarDetalhesSubmissao(submissaoId) {
    try {
        const response = await fetch(`${API_BASE_URL}/testes/submissoes/${submissaoId}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        if (!response.ok) throw new Error('Falha ao carregar os detalhes da submissão.');

        const submissao = await response.json();

        // Preenche o cabeçalho
        document.getElementById('nomeCandidato').innerText = submissao.candidato ? `${submissao.candidato.nome} ${submissao.candidato.sobrenome}` : 'Desconhecido';
        document.getElementById('dataSubmissao').innerText = new Date(submissao.dataSubmissao).toLocaleString('pt-BR');

        const spanPontuacao = document.getElementById('pontuacaoFinal');
        if (submissao.pontuacao !== null && submissao.pontuacao !== undefined) {
            spanPontuacao.innerText = `${submissao.pontuacao.toFixed(1)}%`;
            spanPontuacao.className = submissao.pontuacao >= 70 ? 'mb-0 text-success' : (submissao.pontuacao >= 50 ? 'mb-0 text-warning' : 'mb-0 text-danger');
        } else {
            spanPontuacao.innerText = 'Discursivo';
            spanPontuacao.className = 'mb-0 text-info';
        }

        // Renderiza as respostas
        renderizarRespostas(submissao.respostas);

    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('containerRespostas').innerHTML = `<p class="text-danger text-center">${error.message}</p>`;
    }
}

function renderizarRespostas(respostasSubmetidas) {
    const container = document.getElementById('containerRespostas');
    container.innerHTML = '';

    if (!respostasSubmetidas || respostasSubmetidas.length === 0) {
        container.innerHTML = '<p class="text-muted text-center">Nenhuma resposta encontrada.</p>';
        return;
    }

    respostasSubmetidas.forEach((respSub, index) => {
        const pergunta = respSub.pergunta;
        if (!pergunta) return; // Pula se a pergunta for nula

        let respostaCandidatoObj;
        try {
            respostaCandidatoObj = JSON.parse(respSub.resposta);
        } catch(e) {
            respostaCandidatoObj = respSub.resposta;
        }

        const divCard = document.createElement('div');
        divCard.className = 'card mb-3 bg-dark-2';

        let conteudoResposta = '';

        if (pergunta.tipoResposta === 'MULTIPLA_ESCOLHA') {
            const resposCandArray = Array.isArray(respostaCandidatoObj) ? respostaCandidatoObj.map(Number) : [Number(respostaCandidatoObj)];
            const gabaritoArray = pergunta.respostasCorretas || [];

            const listaOpcoes = pergunta.opcoesResposta.map((opcaoTexto, i) => {
                const isCandSelected = resposCandArray.includes(i);
                const isCorrectAnswer = gabaritoArray.includes(i);

                let cssClass = '';
                let icon = '<i class="zmdi zmdi-circle-o mr-2"></i>';

                if (isCandSelected && isCorrectAnswer) {
                    cssClass = 'bg-correct text-success';
                    icon = '<i class="zmdi zmdi-check-circle mr-2"></i>';
                } else if (isCandSelected && !isCorrectAnswer) {
                    cssClass = 'bg-incorrect text-danger';
                    icon = '<i class="zmdi zmdi-close-circle mr-2"></i>';
                } else if (!isCandSelected && isCorrectAnswer) {
                    cssClass = 'bg-missed text-warning';
                    icon = '<i class="zmdi zmdi-info-outline mr-2" title="Candidato não marcou, mas esta era correta"></i>';
                }

                return `<div class="opcao-label ${cssClass}">${icon} ${opcaoTexto}</div>`;
            }).join('');

            conteudoResposta = listaOpcoes;

        } else {
            conteudoResposta = `
                <div class="p-3 border border-light rounded mb-2">
                    <strong class="text-white-50 small">Resposta do Candidato:</strong><br>
                    <span class="text-white" style="white-space: pre-wrap;">${respostaCandidatoObj || '<em>Nenhuma resposta fornecida</em>'}</span>
                </div>
                ${pergunta.respostaCorreta ? `
                <div class="p-3 border border-success rounded bg-success-light" style="background: rgba(40,167,69,0.1)">
                    <strong class="text-success small">Gabarito Esperado:</strong><br>
                    <span class="text-white" style="white-space: pre-wrap;">${pergunta.respostaCorreta}</span>
                </div>` : ''}
            `;
        }

        divCard.innerHTML = `
            <div class="card-body">
                <h6 class="card-title text-white">${index + 1}. ${pergunta.texto}</h6>
                ${pergunta.filePath ? `<a href="${API_BASE_URL}/files/${pergunta.filePath}" target="_blank" class="small d-block mb-3"><i class="zmdi zmdi-attachment-alt"></i> Ver Anexo da Questão</a>` : ''}
                <div class="mt-3">
                    ${conteudoResposta}
                </div>
            </div>
        `;

        container.appendChild(divCard);
    });
}
