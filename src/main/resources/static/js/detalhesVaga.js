document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const vagaId = urlParams.get('id');

    if (vagaId) {
        carregarVaga(vagaId);
        verificarInscricao(vagaId);
    } else {
        alert("Vaga não encontrada.");
        window.location.href = "mainCandidato.html";
    }
});

function carregarVaga(id) {
    fetch(`http://localhost:8080/api/vagas/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('Erro ao buscar vaga');
            return response.json();
        })
        .then(vaga => {
            document.getElementById('tituloVaga').innerText = vaga.nomeVaga;
            document.getElementById('empresaVaga').innerText = vaga.empresa ? vaga.empresa.nome : 'Empresa Confidencial';
            document.getElementById('localVaga').innerText = `${vaga.cidade} - ${vaga.estado}`;
            document.getElementById('modalidadeVaga').innerText = vaga.modalidade;
            document.getElementById('nivelVaga').innerText = vaga.nivelExperiencia;
            document.getElementById('salarioVaga').innerText = vaga.salario;
            document.getElementById('setorVaga').innerText = vaga.setorVaga;
            document.getElementById('dataVaga').innerText = new Date(vaga.dataPostagem).toLocaleDateString('pt-BR');
            document.getElementById('descricaoVaga').innerText = vaga.descricaoVaga;
        })
        .catch(error => {
            console.error('Erro:', error);
            alert('Erro ao carregar detalhes da vaga.');
        });
}

async function verificarInscricao(vagaId) {
    const candidatoId = localStorage.getItem('candidatoId');
    if (!candidatoId) return;

    try {
        const response = await fetch(`http://localhost:8080/api/candidaturas/candidato/${candidatoId}/vagas`);
        if (response.ok) {
            const vagasInscritas = await response.json();
            if (vagasInscritas.includes(parseInt(vagaId))) {
                const btnCandidatar = document.querySelector('button[onclick="candidatarSe()"]');
                if (btnCandidatar) {
                    btnCandidatar.innerText = "Já Inscrito";
                    btnCandidatar.classList.remove('btn-success');
                    btnCandidatar.classList.add('btn-secondary');
                    btnCandidatar.disabled = true;
                    btnCandidatar.onclick = null;
                }
            }
        }
    } catch (error) {
        console.error('Erro ao verificar inscrição:', error);
    }
}

function candidatarSe() {
    const candidatoId = localStorage.getItem('candidatoId');
    if (!candidatoId) {
        alert("Você precisa estar logado para se candidatar.");
        window.location.href = 'signInCandidato.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const vagaId = urlParams.get('id');

    if (!vagaId) {
        alert("Erro ao identificar a vaga.");
        return;
    }

    const dadosInscricao = {
        idCandidato: parseInt(candidatoId),
        idVaga: parseInt(vagaId)
    };

    fetch('http://localhost:8080/api/candidaturas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dadosInscricao)
    })
    .then(async response => {
        if (response.ok) {
            alert("Candidatura realizada com sucesso! Boa sorte!");
            window.location.href = "mainCandidato.html";
        } else {
            const erroObj = await response.json();
            alert(erroObj.mensagem || "Erro ao realizar candidatura.");
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        alert("Erro de conexão com o servidor.");
    });
}