let currentDestinatarioId = null;
let currentDestinatarioTipo = null;
let currentRemetenteId = null;
let currentRemetenteTipo = null;
let pollingInterval = null;

document.addEventListener('DOMContentLoaded', function() {
    // Identificar usuário logado
    currentRemetenteId = localStorage.getItem('recrutadorId');
    currentRemetenteTipo = 'RECRUTADOR';

    if (!currentRemetenteId) {
        currentRemetenteId = localStorage.getItem('candidatoId');
        currentRemetenteTipo = 'CANDIDATO';
    }

    if (!currentRemetenteId) {
        window.location.href = 'index.html';
        return;
    }

    // Configurar navegação
    const navBrand = document.getElementById('navBrand');
    const navDashboard = document.getElementById('navDashboard');
    if (currentRemetenteTipo === 'RECRUTADOR') {
        navBrand.href = 'mainRecrutador.html';
        navDashboard.href = 'mainRecrutador.html';
    } else {
        navBrand.href = 'mainCandidato.html';
        navDashboard.href = 'mainCandidato.html';
    }

    // Carregar lista de contatos
    carregarContatos();

    // Verificar se veio de um link externo com destinatário pré-selecionado
    const urlParams = new URLSearchParams(window.location.search);
    const destId = urlParams.get('destinatarioId');
    const destTipo = urlParams.get('destinatarioTipo');
    const destNome = urlParams.get('destinatarioNome');

    if (destId && destTipo) {
        selecionarContato(destId, destTipo, destNome || 'Usuário');
    }

    // Enviar mensagem ao pressionar Enter
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            enviarMensagem();
        }
    });
});

function carregarContatos() {
    fetch(`http://localhost:8080/api/mensagens/contatos?usuarioId=${currentRemetenteId}&usuarioTipo=${currentRemetenteTipo}`)
        .then(response => response.json())
        .then(contatos => {
            const contactsList = document.getElementById('contactsList');
            contactsList.innerHTML = '';

            if (contatos.length === 0) {
                contactsList.innerHTML = '<div class="p-3 text-center text-muted">Nenhum contato recente.</div>';
                return;
            }

            contatos.forEach(contato => {
                const avatarLetter = contato.nome.charAt(0).toUpperCase();
                const item = `
                    <div class="contact-item" onclick="selecionarContato(${contato.id}, '${contato.tipo}', '${contato.nome}')">
                        <div class="contact-avatar bg-secondary">${avatarLetter}</div>
                        <div>
                            <h6 class="mb-0">${contato.nome}</h6>
                            <small class="text-muted">${contato.tipo === 'RECRUTADOR' ? 'Recrutador' : 'Candidato'}</small>
                        </div>
                    </div>
                `;
                contactsList.insertAdjacentHTML('beforeend', item);
            });
        })
        .catch(error => console.error('Erro ao carregar contatos:', error));
}

function selecionarContato(id, tipo, nome) {
    currentDestinatarioId = id;
    currentDestinatarioTipo = tipo;

    // Atualizar UI
    document.getElementById('headerName').textContent = nome;
    document.getElementById('headerAvatar').textContent = nome.charAt(0).toUpperCase();
    document.getElementById('chatHeader').style.display = 'flex';
    document.getElementById('chatInputArea').style.display = 'flex';

    // Limpar mensagens anteriores
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = ''; // Limpa o estado vazio

    // Carregar mensagens imediatamente
    carregarMensagens();

    // Configurar polling
    if (pollingInterval) clearInterval(pollingInterval);
    pollingInterval = setInterval(carregarMensagens, 3000);
}

function carregarMensagens() {
    if (!currentDestinatarioId) return;

    const url = `http://localhost:8080/api/mensagens/conversa?usuario1Id=${currentRemetenteId}&usuario1Tipo=${currentRemetenteTipo}&usuario2Id=${currentDestinatarioId}&usuario2Tipo=${currentDestinatarioTipo}`;

    fetch(url)
        .then(response => response.json())
        .then(mensagens => {
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.innerHTML = ''; // Limpa para re-renderizar (idealmente faria diff, mas ok para MVP)

            if (mensagens.length === 0) {
                chatMessages.innerHTML = '<div class="text-center text-muted mt-5">Nenhuma mensagem ainda. Diga olá!</div>';
                return;
            }

            mensagens.forEach(msg => {
                const isSent = (msg.remetenteId == currentRemetenteId && msg.remetenteTipo === currentRemetenteTipo);
                const messageClass = isSent ? 'sent' : 'received';
                const time = new Date(msg.dataEnvio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

                const html = `
                    <div class="message ${messageClass}">
                        ${msg.conteudo}
                        <div class="message-time">${time}</div>
                    </div>
                `;
                chatMessages.insertAdjacentHTML('beforeend', html);
            });

            chatMessages.scrollTop = chatMessages.scrollHeight;
        })
        .catch(error => console.error('Erro ao carregar mensagens:', error));
}

function enviarMensagem() {
    const input = document.getElementById('messageInput');
    const conteudo = input.value.trim();
    if (!conteudo || !currentDestinatarioId) return;

    const mensagem = {
        remetenteId: parseInt(currentRemetenteId),
        remetenteTipo: currentRemetenteTipo,
        destinatarioId: parseInt(currentDestinatarioId),
        destinatarioTipo: currentDestinatarioTipo,
        conteudo: conteudo
    };

    fetch('http://localhost:8080/api/mensagens', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mensagem)
    })
    .then(response => {
        if (response.ok) {
            input.value = '';
            carregarMensagens();
            // Atualizar lista de contatos para garantir que o novo contato apareça se for o primeiro envio
            carregarContatos();
        }
    })
    .catch(error => console.error('Erro:', error));
}
