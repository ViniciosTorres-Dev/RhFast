const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recrutadorId = urlParams.get('id');

    if (!recrutadorId) {
        alert('ID do recrutador não fornecido.');
        window.history.back();
        return;
    }

    carregarPerfil(recrutadorId);
});

async function carregarPerfil(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/recrutadores/${id}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        if (!response.ok) {
            throw new Error('Falha ao carregar perfil do recrutador.');
        }

        const recrutador = await response.json();

        document.getElementById('nomeRecrutador').innerText = `${recrutador.nome} ${recrutador.sobrenome}`;
        document.getElementById('cargoRecrutador').innerText = recrutador.cargo;

        if (recrutador.empresa) {
            document.getElementById('nomeEmpresa').innerText = recrutador.empresa.nome;
            document.getElementById('localEmpresa').innerText = `${recrutador.empresa.cidade}, ${recrutador.empresa.estado}`;
        } else {
            document.getElementById('nomeEmpresa').innerText = 'Empresa não informada';
        }

    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('nomeRecrutador').innerText = "Recrutador não encontrado";
        document.getElementById('cargoRecrutador').innerText = "";
        document.getElementById('nomeEmpresa').innerText = "";
        document.getElementById('localEmpresa').innerText = "";
    }
}
