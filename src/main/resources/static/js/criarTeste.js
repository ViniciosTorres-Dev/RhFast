document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const vagaId = urlParams.get('vagaId');

    if (!vagaId) {
        alert('Vaga não especificada!');
        window.location.href = 'mainRecrutador.html';
        return;
    }

    document.getElementById('btnVoltarVaga').href = `detalhesVagaRecrutador.html?id=${vagaId}`;

    document.getElementById('formCriarTeste').addEventListener('submit', function(e) {
        e.preventDefault();
        salvarTeste(vagaId);
    });
});

let perguntaCount = 0;

function adicionarPergunta() {
    perguntaCount++;
    const container = document.getElementById('perguntasContainer');
    const perguntaHtml = `
        <div class="card mb-3" id="pergunta-${perguntaCount}">
            <div class="card-body">
                <div class="form-group">
                    <label>Pergunta ${perguntaCount}</label>
                    <input type="text" class="form-control" name="perguntaTexto" required>
                </div>
                <div class="form-group">
                    <label>Tipo de Resposta</label>
                    <select class="form-control" name="tipoResposta" onchange="mudarTipoResposta(this, ${perguntaCount})">
                        <option value="TEXTO">Texto Livre</option>
                        <option value="MULTIPLA_ESCOLHA">Múltipla Escolha</option>
                    </select>
                </div>
                <div id="opcoes-${perguntaCount}" style="display: none;">
                    <label>Opções (separadas por vírgula)</label>
                    <input type="text" class="form-control" name="opcoesResposta" placeholder="Opção 1, Opção 2, Opção 3">
                </div>
                <button type="button" class="btn btn-danger btn-sm mt-2" onclick="removerPergunta(${perguntaCount})">Remover</button>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', perguntaHtml);
}

function mudarTipoResposta(select, id) {
    const opcoesDiv = document.getElementById(`opcoes-${id}`);
    if (select.value === 'MULTIPLA_ESCOLHA') {
        opcoesDiv.style.display = 'block';
    } else {
        opcoesDiv.style.display = 'none';
    }
}

function removerPergunta(id) {
    const perguntaDiv = document.getElementById(`pergunta-${id}`);
    perguntaDiv.remove();
}

function salvarTeste(vagaId) {
    const titulo = document.getElementById('tituloTeste').value;
    const tipo = document.getElementById('tipoTeste').value;
    const descricao = document.getElementById('descricaoTeste').value;

    const perguntas = [];
    const perguntaElements = document.querySelectorAll('[id^="pergunta-"]');

    perguntaElements.forEach(el => {
        const texto = el.querySelector('[name="perguntaTexto"]').value;
        const tipoResp = el.querySelector('[name="tipoResposta"]').value;
        const opcoes = el.querySelector('[name="opcoesResposta"]').value;

        perguntas.push({
            texto: texto,
            tipoResposta: tipoResp,
            opcoesResposta: opcoes ? opcoes.split(',').map(s => s.trim()) : []
        });
    });

    const testeData = {
        titulo: titulo,
        tipo: tipo,
        descricao: descricao,
        perguntas: perguntas
    };

    fetch(`http://localhost:8080/api/testes/vaga/${vagaId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(testeData)
    })
    .then(response => {
        if (response.ok) {
            alert('Teste criado com sucesso!');
            window.location.href = `detalhesVagaRecrutador.html?id=${vagaId}`;
        } else {
            alert('Erro ao criar teste.');
        }
    })
    .catch(error => console.error('Erro:', error));
}
