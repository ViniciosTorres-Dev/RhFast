const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', async function() {
    const isLogged = await checkLogin();
    if (isLogged) {
        loadVagas();
    }
});

async function checkLogin() {
    const candidatoId = localStorage.getItem('candidatoId');
    if (!candidatoId) {
        window.location.href = 'signInCandidato.html';
        return false;
    }
    if (localStorage.getItem('recrutadorId')) {
        localStorage.clear();
        window.location.href = 'signInCandidato.html';
        return false;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/candidatos/${candidatoId}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        if (res.ok) {
            const user = await res.json();
            const navNome = document.getElementById('navNomeCandidato');
            if(navNome) navNome.innerText = user.nome + ' ' + user.sobrenome;
            return true;
        } else {
            const navNome = document.getElementById('navNomeCandidato');
            if(navNome) navNome.innerText = "Usuário Não Encontrado";
            const subtitle = document.querySelector('.user-subtitle');
            if(subtitle) subtitle.innerText = "";
            document.querySelectorAll('img[alt="user avatar"]').forEach(img => img.style.display = 'none');
            localStorage.clear();
            return false;
        }
    } catch (e) {
        console.error("Erro ao verificar sessão:", e);
        return false;
    }
}

async function loadVagas() {
    const candidatoId = localStorage.getItem('candidatoId');
    const listaVagas = document.getElementById('listaVagas');

    try {
        // A URL agora busca diretamente as vagas disponíveis para o candidato
        const response = await fetch(`${API_BASE_URL}/vagas/disponiveis/${candidatoId}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (!response.ok) throw new Error('Erro ao carregar vagas');

        const vagas = await response.json();
        renderVagas(vagas);

    } catch (error) {
        console.error('Erro ao carregar vagas:', error);
        if(listaVagas) listaVagas.innerHTML = '<div class="col-12 text-center text-danger"><p>Erro ao carregar vagas. Tente novamente mais tarde.</p></div>';
    }
}

function renderVagas(vagas) {
    const listaVagas = document.getElementById('listaVagas');
    if (!listaVagas) return;
    listaVagas.innerHTML = '';

    if (vagas.length === 0) {
        listaVagas.innerHTML = '<div class="col-12 text-center mt-5"><p class="text-muted">Nenhuma nova vaga encontrada no momento. Verifique suas candidaturas para ver o andamento dos processos.</p></div>';
        return;
    }

    vagas.forEach(vaga => {
        const card = `
            <div class="col-md-4 mb-4">
                <div class="card h-100 card-vaga">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${vaga.nomeVaga}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${vaga.empresa ? vaga.empresa.nome : 'Empresa Confidencial'}</h6>
                        <p class="card-text flex-grow-1">${vaga.descricaoVaga.substring(0, 100)}...</p>
                        <ul class="list-unstyled mt-3">
                            <li><i class="zmdi zmdi-pin mr-2"></i>${vaga.cidade} - ${vaga.estado}</li>
                            <li><i class="zmdi zmdi-money-box mr-2"></i>R$ ${vaga.salario.toFixed(2)}</li>
                            <li><i class="zmdi zmdi-laptop-mac mr-2"></i>${vaga.modalidade}</li>
                        </ul>
                        <a href="detalhesVaga.html?id=${vaga.id}" class="btn btn-primary btn-block mt-auto">Ver Detalhes</a>
                    </div>
                </div>
            </div>
        `;
        listaVagas.insertAdjacentHTML('beforeend', card);
    });
}
