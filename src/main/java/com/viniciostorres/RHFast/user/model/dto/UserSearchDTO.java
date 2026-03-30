package com.viniciostorres.RHFast.user.model.dto;

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

    // Getters e Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public String getEmpresa() {
        return empresa;
    }

    public void setEmpresa(String empresa) {
        this.empresa = empresa;
    }
}