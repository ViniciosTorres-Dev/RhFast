const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const vagaId = urlParams.get('id');

    if (!vagaId) {
        alert('ID da vaga não fornecido!');
        window.history.back();
        return;
    }

    document.getElementById('vagaId').value = vagaId;
    loadVagaParaEdicao(vagaId);

    document.getElementById('editarVagaForm').addEventListener('submit', salvarEdicaoVaga);
});

async function loadVagaParaEdicao(vagaId) {
    try {
        const response = await fetch(`${API_BASE_URL}/vagas/${vagaId}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (!response.ok) throw new Error('Falha ao carregar dados da vaga.');

        const vaga = await response.json();

        // Preenche o formulário
        document.getElementById('nomeVaga').value = vaga.nomeVaga;
        document.getElementById('setorVaga').value = vaga.setorVaga;
        document.getElementById('salario').value = vaga.salario;
        document.getElementById('cep').value = vaga.cep;
        document.getElementById('cidade').value = vaga.cidade;
        document.getElementById('estado').value = vaga.estado;
        document.getElementById('pais').value = vaga.pais;
        document.getElementById('nivelExperiencia').value = vaga.nivelExperiencia;
        document.getElementById('modalidade').value = vaga.modalidade;
        document.getElementById('descricaoVaga').value = vaga.descricaoVaga;
        document.getElementById('status').value = vaga.status;
        document.getElementById('recrutadorId').value = vaga.recrutador.id;
        document.getElementById('empresaId').value = vaga.empresa.id;

        // Carrega e marca os testes
        await loadAndCheckTestes(vaga.testes.map(t => t.id));

    } catch (error) {
        console.error('Erro:', error);
        alert('Não foi possível carregar os dados para edição.');
    }
}

async function loadAndCheckTestes(testesAssociadosIds) {
    const container = document.getElementById('testesContainer');
    try {
        const response = await fetch(`${API_BASE_URL}/testes`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (!response.ok) throw new Error('Falha ao carregar testes');

        const todosTestes = await response.json();
        container.innerHTML = '';

        if (todosTestes.length === 0) {
            container.innerHTML = '<p class="text-white-50">Nenhum teste cadastrado.</p>';
            return;
        }

        todosTestes.forEach(teste => {
            const isChecked = testesAssociadosIds.includes(teste.id);
            const div = document.createElement('div');
            div.className = 'form-check';
            div.innerHTML = `
                <input class="form-check-input" type="checkbox" value="${teste.id}" id="teste-${teste.id}" ${isChecked ? 'checked' : ''}>
                <label class="form-check-label" for="teste-${teste.id}">
                    ${teste.titulo} <span class="text-muted small">- ${teste.tipo}</span>
                </label>
            `;
            container.appendChild(div);
        });

    } catch (error) {
        console.error('Erro:', error);
        container.innerHTML = '<p class="text-danger">Não foi possível carregar os testes.</p>';
    }
}

async function salvarEdicaoVaga(event) {
    event.preventDefault();
    const btn = event.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = 'Salvando...';

    const vagaId = document.getElementById('vagaId').value;

    const testesSelecionados = [];
    document.querySelectorAll('#testesContainer input[type="checkbox"]:checked').forEach(checkbox => {
        testesSelecionados.push(parseInt(checkbox.value));
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
        status: document.getElementById('status').value,
        recrutadorId: document.getElementById('recrutadorId').value,
        empresaId: document.getElementById('empresaId').value,
        testesIds: testesSelecionados
    };

    try {
        const response = await fetch(`${API_BASE_URL}/vagas/${vagaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(vagaData)
        });

        if (response.ok) {
            alert('Vaga atualizada com sucesso!');
            window.location.href = `detalhesVagaRecrutador.html?id=${vagaId}`;
        } else {
            const err = await response.json();
            alert('Erro ao atualizar vaga: ' + (err.message || 'Verifique os dados.'));
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro de conexão ao atualizar vaga.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="zmdi zmdi-save"></i> Salvar Alterações';
    }
}
