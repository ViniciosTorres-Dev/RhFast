package com.viniciostorres.RHFast.user.model.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSearchDTO {
    private Long id;
    private String nome;
    private String tipo; // "CANDIDATO" ou "RECRUTADOR"
    private String empresa; // Apenas para recrutadores

    public UserSearchDTO(Long id, String nome, String tipo, String empresa) {
        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
        this.empresa = empresa;
    }
}