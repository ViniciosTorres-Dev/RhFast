package com.viniciostorres.RHFast.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class ErroResposta {
    private LocalDateTime timestamp;
    private Integer status;
    private String erro;
    private String mensagem;
    private String caminho;
}
