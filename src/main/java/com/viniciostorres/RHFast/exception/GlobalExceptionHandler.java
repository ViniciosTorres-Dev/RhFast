package com.viniciostorres.RHFast.exception;

import com.viniciostorres.RHFast.dto.ErroResposta;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

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

        String mensagemErro = ex.getMessage();
        if (ex.getRootCause() != null) {
            mensagemErro = ex.getRootCause().getMessage();
        }

        ErroResposta erroResposta = ErroResposta.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .erro("Erro de Formatação JSON")
                .mensagem("Erro ao processar a requisição: " + mensagemErro)
                .caminho(request.getRequestURI())
                .build();

        return ResponseEntity.status(erroResposta.getStatus()).body(erroResposta);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResposta> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        ErroResposta erroResposta = ErroResposta.builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .erro("Erro de Validação")
                .mensagem("Verifique os campos obrigatórios: " + errors.toString())
                .caminho(request.getRequestURI())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(erroResposta);
    }
}
