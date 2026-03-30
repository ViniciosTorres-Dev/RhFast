const API_BASE_URL = 'http://localhost:8080/api';

let vagaAtual = null;

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const vagaId = urlParams.get('id');

    if (!vagaId) {
        alert('ID da vaga não fornecido!');
        window.history.back();
        return;
    }

    carregarDetalhesVaga(vagaId);
    carregarTestes(vagaId);
    carregarCandidatosEProcessos(vagaId);
});

async function carregarDetalhesVaga(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/vagas/${id}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (!response.ok) throw new Error('Falha ao carregar os detalhes da vaga.');
        vagaAtual = await response.json();

        document.getElementById('tituloVaga').innerText = vagaAtual.nomeVaga;
        document.getElementById('empresaVaga').innerText = vagaAtual.empresa ? vagaAtual.empresa.nome : 'Empresa não vinculada';
        document.getElementById('localVaga').innerText = `${vagaAtual.cidade}, ${vagaAtual.estado} - ${vagaAtual.pais}`;
        document.getElementById('modalidadeVaga').innerText = vagaAtual.modalidade;
        document.getElementById('salarioVaga').innerText = vagaAtual.salario ? `R$ ${vagaAtual.salario.toFixed(2)}` : 'Não informado';
        document.getElementById('nivelVaga').innerText = vagaAtual.nivelExperiencia;
        document.getElementById('setorVaga').innerText = vagaAtual.setorVaga;
        document.getElementById('dataVaga').innerText = `Publicada em: ${new Date(vagaAtual.dataPostagem).toLocaleDateString('pt-BR')}`;
        document.getElementById('descricaoVaga').innerText = vagaAtual.descricaoVaga;

        const badge = document.getElementById('statusBadge');
        badge.innerText = vagaAtual.status;
        badge.className = `badge badge-${vagaAtual.status === 'ABERTA' ? 'success' : (vagaAtual.status === 'ENCERRADA' ? 'secondary' : 'danger')}`;

        // Preenche o select do modal com o status atual
        document.getElementById('selectStatusVaga').value = vagaAtual.status;

    } catch (error) {
        console.error('Erro:', error);
        alert(error.message);
    }
}

async function salvarNovoStatus() {
    const novoStatus = document.getElementById('selectStatusVaga').value;
    if (!vagaAtual || !novoStatus) return;

    const btn = document.getElementById('btnSalvarStatus');
    btn.disabled = true;
    btn.innerHTML = 'Salvando...';

    try {
        const response = await fetch(`${API_BASE_URL}/vagas/${vagaAtual.id}/status?status=${novoStatus}`, {
            method: 'PUT',
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        if (response.ok) {
            $('#modalMudarStatus').modal('hide');
            carregarDetalhesVaga(vagaAtual.id); // Recarrega os detalhes para mostrar o novo status
        } else {
            const err = await response.json();
            alert('Erro ao alterar status: ' + (err.message || 'Tente novamente.'));
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão ao alterar o status.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="zmdi zmdi-save"></i> Salvar';
    }
}

async function deletarVaga() {
    if (!vagaAtual || !confirm(`Tem certeza que deseja apagar a vaga "${vagaAtual.nomeVaga}"? Esta ação não pode ser desfeita.`)) {
        return;
    }
    // ... (código de exclusão existente)
}

// ... (restante do código do arquivo)
async function carregarCandidatosEProcessos(vagaId) {
    try {
        const [resCandidaturas, resProcessos] = await Promise.all([
            fetch(`${API_BASE_URL}/candidaturas/vaga/${vagaId}`, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } }),
            fetch(`${API_BASE_URL}/onboarding/vaga/${vagaId}`, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } })
        ]);
        if (!resCandidaturas.ok) throw new Error('Falha ao carregar candidatos.');
        const candidaturas = await resCandidaturas.json();
        const processos = resProcessos.ok ? await resProcessos.json() : [];
        const tbody = document.getElementById('tabelaCandidatos');
        tbody.innerHTML = '';
        document.getElementById('countCandidatos').innerText = candidaturas.length;
        if (candidaturas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-white-50">Nenhum candidato inscrito ainda.</td></tr>';
            return;
        }
        candidaturas.forEach(candidatura => {
            const cand = candidatura.candidato;
            const dataInscricao = new Date(candidatura.dataInscricao).toLocaleDateString('pt-BR');
            let statusBadge = '';
            switch(candidatura.status) {
                case 'PENDENTE': statusBadge = '<span class="badge badge-warning">Em Análise</span>'; break;
                case 'EM_TESTE': statusBadge = '<span class="badge badge-info">Em Teste</span>'; break;
                case 'APROVADO': statusBadge = '<span class="badge badge-success">Aprovado</span>'; break;
                case 'REJEITADO': statusBadge = '<span class="badge badge-danger">Reprovado</span>'; break;
                default: statusBadge = `<span class="badge badge-light">${candidatura.status}</span>`;
            }
            let acoes = `<button class="btn btn-sm btn-outline-light mr-1" onclick="verPerfilCandidato(${cand.id})" title="Ver Perfil"><i class="zmdi zmdi-account"></i></button>`;
            const processoAdmissao = processos.find(p => p.candidato.id === cand.id);
            if (processoAdmissao) {
                acoes += `<button class="btn btn-sm btn-primary" onclick="verAdmissao(${processoAdmissao.id})" title="Ver Processo de Admissão">Ver Admissão</button>`;
            } else if (candidatura.status === 'APROVADO') {
               acoes += `<button class="btn btn-sm btn-success" onclick="iniciarAdmissao(${cand.id}, '${cand.nome} ${cand.sobrenome}')" title="Iniciar Onboarding / Admissão">Iniciar Admissão</button>`;
            }
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${cand.nome} ${cand.sobrenome}</td><td>${dataInscricao}</td><td>${statusBadge}</td><td>${acoes}<div class="dropdown d-inline-block"><button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown">Status</button><div class="dropdown-menu" style="background-color:#000;"><a class="dropdown-item text-white" href="#" onclick="mudarStatusCandidatura(${candidatura.id}, 'ANALISE_RH')">Em Análise</a><a class="dropdown-item text-success" href="#" onclick="mudarStatusCandidatura(${candidatura.id}, 'APROVADO')">Aprovar</a><a class="dropdown-item text-danger" href="#" onclick="mudarStatusCandidatura(${candidatura.id}, 'REJEITADO')">Reprovar</a></div></div></td>`;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('tabelaCandidatos').innerHTML = `<tr><td colspan="4" class="text-center text-danger">Erro ao carregar candidatos.</td></tr>`;
    }
}
function verPerfilCandidato(id) { window.location.href = `perfilPublicoCandidato.html?id=${id}`; }
function verAdmissao(processoId) { window.location.href = `detalhesAdmissao.html?processoId=${processoId}`; }
async function carregarTestes(vagaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/testes/vaga/${vagaId}`, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
        if (!response.ok) throw new Error('Falha ao carregar testes');
        const testes = await response.json();
        const listaTestes = document.getElementById('listaTestes');
        if (testes.length === 0) {
            listaTestes.innerHTML = '<p class="text-white-50 small mb-0">Nenhum teste criado para esta vaga.</p>';
            return;
        }
        listaTestes.innerHTML = '';
        testes.forEach(teste => {
            const div = document.createElement('div');
            div.className = 'd-flex justify-content-between align-items-center border-bottom border-light py-2';
            div.innerHTML = `<div><h6 class="mb-0 text-white">${teste.titulo}</h6><small class="text-white-50">${teste.descricao}</small></div><div><button class="btn btn-sm btn-outline-info" onclick="verResultadosTeste(${teste.id}, '${teste.titulo}')">Resultados</button><button class="btn btn-sm btn-outline-danger ml-1" onclick="deletarTeste(${teste.id})"><i class="zmdi zmdi-delete"></i></button></div>`;
            listaTestes.appendChild(div);
        });
    } catch (error) {
        console.error(error);
        document.getElementById('listaTestes').innerHTML = '<p class="text-danger small">Erro ao carregar testes.</p>';
    }
}
function criarTeste() { window.location.href = `criarTeste.html?vagaId=${vagaAtual.id}`; }
function verResultadosTeste(testeId, titulo) { window.location.href = `resultadosTeste.html?testeId=${testeId}&testeTitulo=${encodeURIComponent(titulo)}`;}
async function deletarTeste(id) {
    if(!confirm("Tem certeza que deseja apagar este teste? Resultados podem ser perdidos.")) return;
    try {
        const response = await fetch(`${API_BASE_URL}/testes/${id}`, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
        if(response.ok) { carregarTestes(vagaAtual.id); } else { alert('Erro ao apagar teste'); }
    } catch(e) { console.error(e); }
}
async function mudarStatusCandidatura(idCandidatura, novoStatus) {
    try {
        const responseBusca = await fetch(`${API_BASE_URL}/candidaturas/${idCandidatura}`, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
        const candidatura = await responseBusca.json();
        candidatura.status = novoStatus;
        const responseAtualiza = await fetch(`${API_BASE_URL}/candidaturas/${idCandidatura}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: JSON.stringify(candidatura)
        });
        if (responseAtualiza.ok) { carregarCandidatosEProcessos(vagaAtual.id); } else { alert('Falha ao atualizar status.'); }
    } catch (e) { console.error(e); alert('Erro de conexão.'); }
}
function iniciarAdmissao(candidatoId, nomeCandidato) { window.location.href = `iniciarOnboarding.html?vagaId=${vagaAtual.id}&candidatoId=${candidatoId}&nome=${encodeURIComponent(nomeCandidato)}`; }
function editarVaga() { window.location.href = `editarVaga.html?id=${vagaAtual.id}`; }
