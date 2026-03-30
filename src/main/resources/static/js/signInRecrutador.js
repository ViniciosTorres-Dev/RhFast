const API_BASE_URL = 'http://localhost:8080/api';

(function ($) {
    "use strict";

    $('#formLoginRecrutador').on('submit', function(event){
        event.preventDefault(); // Impede o envio padrão do formulário
        logarRecrutador();
    });

    function logarRecrutador() {
        const email = $('#emailRecrutador').val();
        const senha = $('#senhaRecrutador').val();

        const dadosRecrutador = {
            email: email,
            senha: senha
        };

        fetch(`${API_BASE_URL}/recrutadores/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosRecrutador)
        })
        .then(async resposta => {
            if (resposta.ok) {
                const dados = await resposta.json();
                // Limpa dados de candidato para evitar conflito
                localStorage.removeItem('candidatoId');
                // Salva o ID do recrutador para usar nas requisições autenticadas
                localStorage.setItem('recrutadorId', dados.id);
                
                // Redireciona para o dashboard do recrutador
                window.location.href = "mainRecrutador.html";
            } else {
                // Tenta ler o corpo da resposta como JSON, se falhar, usa texto
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