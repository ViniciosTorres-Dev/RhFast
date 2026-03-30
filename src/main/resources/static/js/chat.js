const API_BASE_URL = 'http://localhost:8080/api';
let currentDestinatarioId = null;
let currentDestinatarioTipo = null;
let currentRemetenteId = null;
let currentRemetenteTipo = null;
let pollingInterval = null;
let searchTimeout = null;

document.addEventListener('DOMContentLoaded', async function() {
    const isLogged = await setupUser();
    if (isLogged) {
        carregarContatos();
        setupEventListeners();
        handleInitialState();
    }
});

async function setupUser() {
    currentRemetenteId = localStorage.getItem('recrutadorId');
    currentRemetenteTipo = 'RECRUTADOR';

    if (!currentRemetenteId) {
        currentRemetenteId = localStorage.getItem('candidatoId');
        currentRemetenteTipo = 'CANDIDATO';
    }

    if (!currentRemetenteId) {
        window.location.href = 'index.html';
        return false;
    }

    try {
        let endpoint = currentRemetenteTipo === 'RECRUTADOR' ? 'recrutadores' : 'candidatos';
        const res = await fetch(`${API_BASE_URL}/${endpoint}/${currentRemetenteId}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });

        if (!res.ok) {
            alert("Sua sessão expirou ou o usuário foi removido.");
            localStorage.clear();
            window.location.href = 'index.html';
            return false;
        }
    } catch (e) {
        console.error("Erro ao verificar sessão:", e);
        return false;
    }

    const isRecrutador = currentRemetenteTipo === 'RECRUTADOR';
    document.getElementById('homeLink').href = isRecrutador ? 'mainRecrutador.html' : 'mainCandidato.html';
    const dashboardLink = document.getElementById('dashboardLink');
    if(dashboardLink) dashboardLink.href = isRecrutador ? 'mainRecrutador.html' : 'mainCandidato.html';
    const dashboardNav = document.getElementById('dashboardNav');
    if(dashboardNav) dashboardNav.style.display = isRecrutador ? 'block' : 'none';
    const vagasNav = document.getElementById('vagasNav');
    if(vagasNav) vagasNav.style.display = isRecrutador ? 'none' : 'block';
    const candidaturasNav = document.getElementById('candidaturasNav');
    if(candidaturasNav) candidaturasNav.style.display = isRecrutador ? 'none' : 'block';
    const configuracoesLink2 = document.getElementById('configuracoesLink2');
    if(configuracoesLink2) configuracoesLink2.href = isRecrutador ? 'configuracoesRecrutador.html' : 'configuracoesCandidato.html';
    const perfilLink = document.getElementById('perfilLink');
    if(perfilLink) perfilLink.href = isRecrutador ? 'perfilRecrutador.html' : 'perfilCandidato.html';

    return true;
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            if (query.length >= 2) {
                searchTimeout = setTimeout(() => searchUsers(query), 300);
            } else {
                document.getElementById('searchResults').style.display = 'none';
                document.getElementById('contactList').style.display = 'block';
                if (query.length === 0) document.getElementById('searchResults').innerHTML = '';
            }
        });
    }

    document.getElementById('chatForm').addEventListener('submit', (e) => {
        e.preventDefault();
        enviarMensagem();
    });

    document.getElementById('btnBackToContacts').addEventListener('click', () => {
        document.getElementById('chatSidebar').style.transform = 'translateX(0)';
    });
}

function handleInitialState() {
    const urlParams = new URLSearchParams(window.location.search);
    const destId = urlParams.get('destinatarioId');
    const destTipo = urlParams.get('destinatarioTipo');
    const destNome = urlParams.get('destinatarioNome');

    if (destId && destTipo) {
        const nomeExibicao = destNome || `Usuário #${destId}`;
        startNewChat(destId, destTipo, nomeExibicao);
    }
}

function searchUsers(query) {
    const url = `${API_BASE_URL}/users/search?query=${encodeURIComponent(query)}`;
    fetch(url, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }})
        .then(response => response.json())
        .then(users => {
            document.getElementById('contactList').style.display = 'none';
            const searchResults = document.getElementById('searchResults');
            searchResults.style.display = 'block';
            displaySearchResults(users);
        })
        .catch(error => console.error('Erro ao buscar usuários:', error));
}

function displaySearchResults(users) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';

    if (users.length === 0) {
        resultsContainer.innerHTML = '<li class="p-3 text-center text-muted">Nenhum usuário encontrado.</li>';
        return;
    }

    users.forEach(user => {
        if (user.id == currentRemetenteId && user.tipo === currentRemetenteTipo) return;

        const avatarLetter = user.nome ? user.nome.charAt(0).toUpperCase() : '?';
        const subtext = user.tipo === 'RECRUTADOR' ? user.empresa || 'Recrutador' : 'Candidato';

        const item = `
            <li onclick="startNewChat(${user.id}, '${user.tipo}', '${user.nome}')">
                <div class="avatar-placeholder">${avatarLetter}</div>
                <div class="contact-details">
                    <h6 class="contact-name">${user.nome}</h6>
                    <p class="contact-last-message">${subtext}</p>
                </div>
            </li>
        `;
        resultsContainer.insertAdjacentHTML('beforeend', item);
    });
}

function startNewChat(userId, userType, userName) {
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').style.display = 'none';
    document.getElementById('contactList').style.display = 'block';

    let contactExists = false;
    document.querySelectorAll('#contactList li').forEach(item => {
        if (item.getAttribute('data-user-id') == userId) {
            contactExists = true;
        }
    });

    if (!contactExists) {
        renderContact({ id: userId, tipo: userType, nome: userName, empresa: '', mensagensNaoLidas: 0 }, false, true);
    }

    selecionarContato(userId, userType, userName);
}

function carregarContatos() {
    const url = `${API_BASE_URL}/mensagens/contatos?usuarioId=${currentRemetenteId}&usuarioTipo=${currentRemetenteTipo}`;
    fetch(url, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }})
        .then(response => response.json())
        .then(contatos => {
            const contactsList = document.getElementById('contactList');
            contactsList.innerHTML = '';

            if (contatos.length === 0) {
                contactsList.innerHTML = '<li class="p-3 text-center text-muted">Nenhum contato recente.</li>';
                return;
            }
            contatos.forEach(contato => renderContact(contato, false));
        })
        .catch(error => console.error('Erro ao carregar contatos:', error));
}

function renderContact(contato, prepend = false, isActive = false) {
    const contactsList = document.getElementById('contactList');

    const isDeleted = !contato.nome;
    const displayName = isDeleted ? "Usuário não encontrado" : contato.nome;
    const avatarLetter = isDeleted ? '?' : contato.nome.charAt(0).toUpperCase();
    const subtext = isDeleted ? 'Conta removida' : (contato.tipo === 'RECRUTADOR' ? contato.empresa || 'Recrutador' : 'Candidato');
    const unreadBadge = contato.mensagensNaoLidas > 0 ? `<span class="unread-badge">${contato.mensagensNaoLidas}</span>` : '';

    const item = document.createElement('li');
    item.setAttribute('data-user-id', contato.id);
    item.setAttribute('data-user-type', contato.tipo);
    if (isActive) item.classList.add('active');
    if (isDeleted) item.style.opacity = 0.5;

    item.innerHTML = `
        <div class="avatar-placeholder">${avatarLetter}</div>
        <div class="contact-details">
            <h6 class="contact-name">${displayName}</h6>
            <p class="contact-last-message">${subtext}</p>
        </div>
        ${unreadBadge}
    `;

    if (isDeleted) {
        item.onclick = () => selecionarContatoInvalido();
    } else {
        item.onclick = () => selecionarContato(contato.id, contato.tipo, contato.nome);
    }

    if (prepend) {
        contactsList.prepend(item);
    } else {
        contactsList.appendChild(item);
    }
}

function selecionarContatoInvalido() {
    if (pollingInterval) clearInterval(pollingInterval);

    document.getElementById('chatHeaderName').innerHTML = "Usuário não encontrado";
    document.getElementById('chatHeaderAvatar').textContent = '?';
    document.getElementById('chatHeaderStatus').textContent = "Offline";

    document.getElementById('messageInput').disabled = true;
    document.getElementById('btnSendMessage').disabled = true;
    document.getElementById('btnDeleteConversation').classList.add('d-none');

    const chatBody = document.getElementById('chatMessages');
    chatBody.innerHTML = '<div class="chat-start"><p>Este usuário não existe mais e não pode receber novas mensagens.</p></div>';

    if (window.innerWidth < 768) {
        document.getElementById('chatSidebar').style.transform = 'translateX(-100%)';
    }

    document.querySelectorAll('#contactList li').forEach(item => item.classList.remove('active'));
}

function selecionarContato(id, tipo, nome) {
    marcarConversaComoLida(id, tipo);

    currentDestinatarioId = id;
    currentDestinatarioTipo = tipo;

    // Transforma o nome no cabeçalho em um link para o perfil público
    const linkPerfil = tipo === 'RECRUTADOR'
        ? `perfilPublicoRecrutador.html?id=${id}`
        : `perfilPublicoCandidato.html?id=${id}`;

    // Link ajustado para não ter sublinhado
    document.getElementById('chatHeaderName').innerHTML = `<a href="${linkPerfil}" class="text-white" title="Ver Perfil de ${nome}" style="text-decoration: none;">${nome}</a>`;
    document.getElementById('chatHeaderAvatar').textContent = nome ? nome.charAt(0).toUpperCase() : '?';
    document.getElementById('chatHeaderStatus').textContent = "Online";

    document.getElementById('messageInput').disabled = false;
    document.getElementById('btnSendMessage').disabled = false;
    document.getElementById('btnDeleteConversation').classList.remove('d-none');

    if (window.innerWidth < 768) {
        document.getElementById('chatSidebar').style.transform = 'translateX(-100%)';
    }

    document.querySelectorAll('#contactList li').forEach(item => item.classList.remove('active'));
    const selectedItem = document.querySelector(`#contactList li[data-user-id='${id}']`);
    if (selectedItem) {
        selectedItem.classList.add('active');
        const badge = selectedItem.querySelector('.unread-badge');
        if (badge) badge.remove();
    }

    carregarMensagens();
    if (pollingInterval) clearInterval(pollingInterval);
    pollingInterval = setInterval(carregarMensagens, 5000);
}

function marcarConversaComoLida(outroUsuarioId, outroUsuarioTipo) {
    const payload = {
        usuarioLogadoId: currentRemetenteId,
        usuarioLogadoTipo: currentRemetenteTipo,
        outroUsuarioId: outroUsuarioId,
        outroUsuarioTipo: outroUsuarioTipo
    };

    fetch(`${API_BASE_URL}/mensagens/marcar-como-lida`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify(payload)
    }).catch(error => console.error('Erro ao marcar mensagens como lidas:', error));
}

function carregarMensagens() {
    if (!currentDestinatarioId) return;

    const url = `${API_BASE_URL}/mensagens/conversa?usuario1Id=${currentRemetenteId}&usuario1Tipo=${currentRemetenteTipo}&usuario2Id=${currentDestinatarioId}&usuario2Tipo=${currentDestinatarioTipo}`;
    fetch(url, { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }})
        .then(response => response.json())
        .then(mensagens => {
            const chatBody = document.getElementById('chatMessages');
            chatBody.innerHTML = '';

            if (mensagens.length === 0) {
                chatBody.innerHTML = '<div class="chat-start"><p>Nenhuma mensagem ainda. Seja o primeiro a falar!</p></div>';
                return;
            }

            mensagens.forEach(msg => {
                const isSent = (msg.remetenteId == currentRemetenteId && msg.remetenteTipo === currentRemetenteTipo);
                const messageClass = isSent ? 'message-right' : 'message-left';
                const time = new Date(msg.dataEnvio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

                const html = `
                    <div class="chat-message ${messageClass}" id="msg-${msg.id}">
                        <div class="message-content">
                            ${msg.conteudo}
                            <div class="message-time">
                                ${time}
                                <i class="zmdi zmdi-delete delete-msg-icon ml-2" onclick="apagarMensagem(${msg.id})" title="Apagar para mim" style="cursor: pointer; opacity: 0.7;"></i>
                            </div>
                        </div>
                    </div>
                `;
                chatBody.insertAdjacentHTML('beforeend', html);
            });
            chatBody.scrollTop = chatBody.scrollHeight;
        })
        .catch(error => console.error('Erro ao carregar mensagens:', error));
}

function apagarMensagem(mensagemId) {
    if (!confirm('Tem certeza que deseja apagar esta mensagem para você? Ela continuará visível para a outra pessoa.')) {
        return;
    }

    const payload = {
        usuarioLogadoId: currentRemetenteId,
        usuarioLogadoTipo: currentRemetenteTipo
    };

    fetch(`${API_BASE_URL}/mensagens/${mensagemId}/apagar-para-mim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            const msgElement = document.getElementById(`msg-${mensagemId}`);
            if (msgElement) {
                msgElement.remove();
            }
        } else {
            alert('Erro ao tentar apagar a mensagem.');
        }
    })
    .catch(error => console.error('Erro ao apagar mensagem:', error));
}

function apagarConversa() {
    if (!currentDestinatarioId) return;

    if (!confirm('Tem certeza que deseja apagar a conversa inteira para você? Isso não apagará as mensagens para o outro participante.')) {
        return;
    }

    const payload = {
        usuarioLogadoId: currentRemetenteId,
        usuarioLogadoTipo: currentRemetenteTipo,
        outroUsuarioId: currentDestinatarioId,
        outroUsuarioTipo: currentDestinatarioTipo
    };

    fetch(`${API_BASE_URL}/mensagens/conversa/apagar-para-mim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('chatMessages').innerHTML = '<div class="chat-start"><p>Conversa apagada.</p></div>';
            document.getElementById('btnDeleteConversation').classList.add('d-none');
            currentDestinatarioId = null;
            currentDestinatarioTipo = null;
            carregarContatos();
        } else {
            alert('Erro ao tentar apagar a conversa.');
        }
    })
    .catch(error => console.error('Erro ao apagar conversa:', error));
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

    fetch(`${API_BASE_URL}/mensagens`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
        body: JSON.stringify(mensagem)
    })
    .then(response => {
        if (response.ok) {
            input.value = '';
            carregarMensagens();
            carregarContatos();
        } else {
            console.error("Falha ao enviar mensagem.");
        }
    })
    .catch(error => console.error('Erro ao enviar mensagem:', error));
}