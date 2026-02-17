const emailInput = document.querySelector('input[name="email"]');
const senhaInput = document.querySelector('input[name="senha"]');

const formulario = document.querySelector('.login100-form');
formulario.addEventListener('submit', (event) => {
    event.preventDefault();

    logarRecrutador();
});

function logarRecrutador() {
    const dadosRecrutador = {
        email: emailInput.value,
        senha: senhaInput.value};

fetch('http://localhost:8080/api/recrutadores/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(dadosRecrutador)
})
    .then(async resposta => {
        if (resposta.ok) {
            window.location.href = "index.html";
        } else {
            const erroObj = await resposta.json();
            alert(erroObj.mensagem)
        }
    })
    .catch(erro => console.error("Erro na conexão:", erro));
}