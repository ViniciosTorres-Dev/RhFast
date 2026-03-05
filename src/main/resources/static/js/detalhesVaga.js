document.addEventListener('DOMContentLoaded', function() {
    checkLogin();
    const urlParams = new URLSearchParams(window.location.search);
    const vagaId = urlParams.get('id');

    if (vagaId) {
        loadVaga(vagaId);
        checkStatusCandidatura(vagaId);
    } else {
        alert('Vaga não encontrada!');
        window.location.href = 'mainCandidato.html';
    }
});

function checkLogin() {
    const candidatoId = localStorage.getItem('candidatoId');
    if (!candidatoId) {
        window.location.href = 'signInCandidato.html';
    }
}

function loadVaga(id) {
    fetch(`http://localhost:8080/api/vagas/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao carregar vaga');
            return response.json();
        })
        .then(vaga => {
            document.getElementById('tituloVaga').textContent = vaga.nomeVaga;
            document.getElementById('empresaVaga').textContent = vaga.empresa ? vaga.empresa.nome : 'Empresa Confidencial';
            document.getElementById('localVaga').textContent = `${vaga.cidade} - ${vaga.estado}`;
            document.getElementById('modalidadeVaga').textContent = vaga.modalidade;
            document.getElementById('nivelVaga').textContent = vaga.nivelExperiencia;
            document.getElementById('salarioVaga').textContent = vaga.salario;
            document.getElementById('setorVaga').textContent = vaga.setorVaga;
            document.getElementById('dataVaga').textContent = new Date(vaga.dataPostagem).toLocaleDateString();
            document.getElementById('descricaoVaga').textContent = vaga.descricaoVaga;
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao carregar detalhes da vaga.');
        });
}

function checkStatusCandidatura(vagaId) {
    const candidatoId = localStorage.getItem('candidatoId');
    if (!candidatoId) return;

    fetch(`http://localhost:8080/api/candidaturas/candidato/${candidatoId}/vagas`)
        .then(response => response.json())
        .then(vagasIds => {
            // Verifica se o ID da vaga atual está na lista de vagas inscritas
            if (vagasIds.includes(parseInt(vagaId))) {
                const btn = document.querySelector('button[onclick="candidatarSe()"]');
                if (btn) {
                    btn.textContent = "Candidatura Realizada";
                    btn.className = "btn btn-secondary btn-lg";
                    btn.disabled = true;
                    btn.removeAttribute('onclick');
                }
            }
        })
        .catch(error => console.error('Erro ao verificar status da candidatura:', error));
}

function candidatarSe() {
    const candidatoId = localStorage.getItem('candidatoId');
    const urlParams = new URLSearchParams(window.location.search);
    const vagaId = urlParams.get('id');

    const inscricaoDTO = {
        idCandidato: parseInt(candidatoId),
        idVaga: parseInt(vagaId)
    };

    fetch('http://localhost:8080/api/candidaturas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(inscricaoDTO)
    })
    .then(async response => {
        if (response.ok) {
            alert('Candidatura realizada com sucesso!');
            // Atualiza o botão visualmente
            const btn = document.querySelector('button[onclick="candidatarSe()"]');
            if (btn) {
                btn.textContent = "Candidatura Realizada";
                btn.className = "btn btn-secondary btn-lg";
                btn.disabled = true;
                btn.removeAttribute('onclick');
            }
        } else {
            const error = await response.json();
            alert(error.message || 'Erro ao realizar candidatura. Você já pode estar inscrito.');
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor.');
    });
}

function voltar() {
    if (document.referrer.includes('minhasCandidaturas.html')) {
        window.location.href = 'minhasCandidaturas.html';
    } else {
        window.location.href = 'mainCandidato.html';
    }
}
