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
        event.preventDefault();
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        if(check) {
            logarCandidato();
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
    
    function logarCandidato() {
        const email = $('input[name="email"]').val();
        const senha = $('input[name="senha"]').val();

        const dadosCandidato = {
            email: email,
            senha: senha
        };

        fetch('http://localhost:8080/api/candidatos/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosCandidato)
        })
        .then(async resposta => {
            if (resposta.ok) {
                const dados = await resposta.json();
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