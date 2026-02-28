document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    loadVagas();
});

function checkLogin() {
    const candidatoId = localStorage.getItem('candidatoId');
    if (!candidatoId) {
        window.location.href = 'signInCandidato.html';
    }
    // Se estiver logado como recrutador, redireciona ou limpa
    if (localStorage.getItem('recrutadorId')) {
        localStorage.removeItem('recrutadorId');
    }
}

async function loadVagas(filtros = {}) {
    const candidatoId = localStorage.getItem('candidatoId');
    let vagasInscritas = [];

    // Busca as vagas que o candidato já se inscreveu
    if (candidatoId) {
        try {
            const response = await fetch(`http://localhost:8080/api/candidaturas/candidato/${candidatoId}/vagas`);
            if (response.ok) {
                vagasInscritas = await response.json();
            }
        } catch (error) {
            console.error('Erro ao buscar inscrições:', error);
        }
    }

    let url = 'http://localhost:8080/api/vagas/buscar';
    const params = new URLSearchParams();

    if (filtros.termo) params.append('termo', filtros.termo);
    if (filtros.localizacao) params.append('localizacao', filtros.localizacao);
    if (filtros.nivel) params.append('nivel', filtros.nivel);
    if (filtros.modalidade) params.append('modalidade', filtros.modalidade);

    if (params.toString()) {
        url += `?${params.toString()}`;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao carregar vagas');
            return response.json();
        })
        .then(vagas => {
            const listaVagas = document.getElementById('listaVagas');
            listaVagas.innerHTML = '';

            if (vagas.length === 0) {
                listaVagas.innerHTML = '<div class="col-12 text-center"><p>Nenhuma vaga encontrada.</p></div>';
                return;
            }

            vagas.forEach(vaga => {
                const jaInscrito = vagasInscritas.includes(vaga.id);
                const botaoTexto = jaInscrito ? 'Já Inscrito' : 'Ver Detalhes';
                const botaoClass = jaInscrito ? 'btn btn-success btn-block disabled' : 'btn btn-primary btn-block';
                const linkHref = jaInscrito ? '#' : `detalhesVaga.html?id=${vaga.id}`;

                const card = `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title">${vaga.nomeVaga}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">${vaga.empresa ? vaga.empresa.nome : 'Empresa Confidencial'}</h6>
                                <p class="card-text">${vaga.descricaoVaga.substring(0, 100)}...</p>
                                <ul class="list-unstyled">
                                    <li><i class="zmdi zmdi-pin"></i> ${vaga.cidade} - ${vaga.estado}</li>
                                    <li><i class="zmdi zmdi-money"></i> R$ ${vaga.salario}</li>
                                    <li><i class="zmdi zmdi-time"></i> ${vaga.modalidade}</li>
                                </ul>
                            </div>
                            <div class="card-footer bg-transparent border-top-0">
                                <a href="${linkHref}" class="${botaoClass}">${botaoTexto}</a>
                            </div>
                        </div>
                    </div>
                `;
                listaVagas.insertAdjacentHTML('beforeend', card);
            });
        })
        .catch(error => console.error('Erro:', error));
}

document.getElementById('filtroForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const filtros = {
        termo: document.getElementById('termo').value,
        localizacao: document.getElementById('localizacao').value,
        nivel: document.getElementById('nivel').value,
        modalidade: document.getElementById('modalidade').value
    };
    loadVagas(filtros);
});

function limparFiltros() {
    document.getElementById('filtroForm').reset();
    loadVagas();
}
