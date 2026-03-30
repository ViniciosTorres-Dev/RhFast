const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', async function() {
    const isLogged = await checkLogin();
    if(isLogged) {
        loadDashboardData();
        loadVagasRecentes();
    }
});

async function checkLogin() {
    const recrutadorId = localStorage.getItem('recrutadorId');
    if (!recrutadorId) {
        window.location.href = 'signInRecrutador.html';
        return false;
    }
    if (localStorage.getItem('candidatoId')) {
        localStorage.clear();
        window.location.href = 'signInRecrutador.html';
        return false;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/recrutadores/${recrutadorId}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        if (res.ok) {
            const user = await res.json();
            const navNome = document.getElementById('navNomeRecrutador');
            if(navNome) navNome.innerText = user.nome + ' ' + user.sobrenome;
            return true;
        } else {
            const navNome = document.getElementById('navNomeRecrutador');
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

async function loadDashboardData() {
    const recrutadorId = localStorage.getItem('recrutadorId');

    try {
        const response = await fetch(`${API_BASE_URL}/vagas/dashboard/${recrutadorId}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        if (!response.ok) throw new Error('Falha ao carregar dados do dashboard.');

        const data = await response.json();

        document.getElementById('totalVagasAbertas').innerText = data.totalVagasAbertas;
        document.getElementById('vagasEncerradas').innerText = data.vagasEncerradas;
        document.getElementById('totalCandidatos').innerText = data.totalCandidatosInscritos;
        document.getElementById('novosCandidatosHoje').innerText = data.candidaturasHoje;

        document.getElementById('candidatosAtivos').innerText = data.candidatosEmAnalise;
        document.getElementById('testesConcluidos').innerText = data.totalTestesConcluidos;

        document.getElementById('lblEmAnalise').innerText = data.candidatosEmAnalise;
        document.getElementById('lblAprovados').innerText = data.candidatosAprovados;
        document.getElementById('lblReprovados').innerText = data.candidatosReprovados;

        initCharts(data);

    } catch (error) {
        console.error('Erro no Dashboard:', error);
    }
}

async function loadVagasRecentes() {
    const recrutadorId = localStorage.getItem('recrutadorId');
    try {
        const response = await fetch(`${API_BASE_URL}/vagas/recrutador/${recrutadorId}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (!response.ok) throw new Error('Falha ao carregar vagas recentes');

        const vagas = await response.json();
        const tbody = document.getElementById('tabelaVagasBody');
        tbody.innerHTML = '';

        const vagasRecentes = vagas.sort((a,b) => new Date(b.dataPostagem) - new Date(a.dataPostagem)).slice(0, 5);

        if(vagasRecentes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-white-50">Nenhuma vaga encontrada.</td></tr>';
            return;
        }

        vagasRecentes.forEach(vaga => {
            let statusBadge = '';
            if (vaga.status === 'ABERTA') statusBadge = '<span class="badge badge-success">Aberta</span>';
            else if (vaga.status === 'ENCERRADA') statusBadge = '<span class="badge badge-secondary">Encerrada</span>';
            else statusBadge = '<span class="badge badge-danger">Cancelada</span>';

            const tr = `
                <tr>
                    <td>${vaga.nomeVaga}</td>
                    <td>${vaga.modalidade}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <a href="detalhesVagaRecrutador.html?id=${vaga.id}" class="btn btn-sm btn-outline-light"><i class="icon-eye"></i> Detalhes</a>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', tr);
        });

    } catch(e) {
        console.error("Erro ao carregar vagas recentes:", e);
    }
}

function initCharts(dashboardData) {
    // Gráfico de Status de Candidaturas (Doughnut)
    if (document.getElementById("candidaturasChart")) {
        var ctx2 = document.getElementById("candidaturasChart").getContext('2d');
        if(window.myPieChart) window.myPieChart.destroy();
        window.myPieChart = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ["Em Análise", "Aprovados", "Reprovados"],
                datasets: [{
                    backgroundColor: ["#ffffff", "rgba(255, 255, 255, 0.70)", "rgba(255, 255, 255, 0.20)"],
                    data: [dashboardData.candidatosEmAnalise, dashboardData.candidatosAprovados, dashboardData.candidatosReprovados],
                    borderWidth: [0, 0, 0]
                }]
            },
            options: {
                maintainAspectRatio: false,
                legend: { display: false },
                cutoutPercentage: 80,
                tooltips: { displayColors: false }
            }
        });
    }

    // Gráfico de Desempenho Mensal (Linha)
    if (document.getElementById("mensalChart")) {
        const labels = Object.keys(dashboardData.candidaturasPorMes);
        const data = Object.values(dashboardData.candidaturasPorMes);

        var ctx = document.getElementById("mensalChart").getContext('2d');
        if(window.myLineChart) window.myLineChart.destroy();
        window.myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: "Inscrições",
                    data: data,
                    borderColor: '#fff',
                    pointBackgroundColor: '#fff',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: '#fff',
                    fill: false,
                    tension: 0.4
                }]
            },
            options: {
                maintainAspectRatio: false,
                legend: { display: false },
                scales: {
                    xAxes: [{ ticks: { fontColor: '#fff' }, gridLines: { display: false, color: "rgba(255,255,255,0.1)" } }],
                    yAxes: [{ ticks: { beginAtZero: true, fontColor: '#fff' }, gridLines: { display: true, color: "rgba(255,255,255,0.1)" } }]
                }
            }
        });
    }
}
