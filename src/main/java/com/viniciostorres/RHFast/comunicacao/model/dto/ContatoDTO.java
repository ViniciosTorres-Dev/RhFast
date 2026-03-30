package com.viniciostorres.RHFast.comunicacao.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ContatoDTO {
    private Long id;
    private String nome;
    private String tipo;
    private String empresa;
    private long mensagensNaoLidas;

    public ContatoDTO(Long id, String nome, String tipo, String empresa, long mensagensNaoLidas) {
        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
        this.empresa = empresa;
        this.mensagensNaoLidas = mensagensNaoLidas;
    }
}