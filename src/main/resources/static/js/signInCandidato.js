const API_BASE_URL = 'http://localhost:8080/api';

(function ($) {
    "use strict";

    $('#formLoginCandidato').on('submit', function(event){
        event.preventDefault();
        logarCandidato();
    });

    function logarCandidato() {
        const email = $('#emailCandidato').val();
        const senha = $('#senhaCandidato').val();

        const dadosCandidato = {
            email: email,
            senha: senha
        };

        fetch(`${API_BASE_URL}/candidatos/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosCandidato)
        })
        .then(async resposta => {
            if (resposta.ok) {
                const dados = await resposta.json();
                // Limpa dados de recrutador para evitar conflito
                localStorage.removeItem('recrutadorId');
                localStorage.setItem('candidatoId', dados.id);
                window.location.href = "mainCandidato.html";
            } else {
                try {
                    const erroObj = await resposta.json();
                    alert(erroObj.mensagem || "Erro ao realizar login.");
                } catch (e) {
                    alert("Erro ao realizar login. Verifique suas credenciais.");
                }
            }
        })
        .catch(erro => {
            console.error("Erro na conexão:", erro);
            alert("Erro de conexão com o servidor.");
        });
    }

})(jQuery);