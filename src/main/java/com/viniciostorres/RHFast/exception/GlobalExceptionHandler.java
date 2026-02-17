package com.viniciostorres.RHFast.exception;

import com.viniciostorres.RHFast.dto.ErroResposta;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<ErroResposta> handleRegrasDeNegocio(RuntimeException ex, HttpServletRequest request) {

        ErroResposta erroResposta = ErroResposta.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .erro("Erro de Regra de Negócio")
                .mensagem(ex.getMessage())
                .caminho(request.getRequestURI())
                .build();

        return ResponseEntity.status(erroResposta.getStatus()).body(erroResposta);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErroResposta> handleErrosDeLeitura(HttpMessageNotReadableException ex, HttpServletRequest request) {

        ErroResposta erroResposta = ErroResposta.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .erro("Erro de Formatação")
                .mensagem("Preencha todos os campos obrigatórios, incluindo as listas de seleção.")
                .caminho(request.getRequestURI())
                .build();

        return ResponseEntity.status(erroResposta.getStatus()).body(erroResposta);
    }
}