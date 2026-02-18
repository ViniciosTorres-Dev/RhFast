(function ($) {
    "use strict";

    /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(event){
        event.preventDefault(); // Impede o envio padrão do formulário
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        if(check) {
            logarRecrutador();
        }

        return check;
    });

    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();
        $(thisAlert).removeClass('alert-validate');
    }
    
    /*==================================================================
    [ Show pass ]*/
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass == 0) {
            $(this).next('input').attr('type','text');
            $(this).find('i').removeClass('zmdi-eye');
            $(this).find('i').addClass('zmdi-eye-off');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).find('i').addClass('zmdi-eye');
            $(this).find('i').removeClass('zmdi-eye-off');
            showPass = 0;
        }
        
    });

    function logarRecrutador() {
        const email = $('input[name="email"]').val();
        const senha = $('input[name="senha"]').val();

        const dadosRecrutador = {
            email: email,
            senha: senha
        };

        fetch('http://localhost:8080/api/recrutadores/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosRecrutador)
        })
        .then(async resposta => {
            if (resposta.ok) {
                const dados = await resposta.json();
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