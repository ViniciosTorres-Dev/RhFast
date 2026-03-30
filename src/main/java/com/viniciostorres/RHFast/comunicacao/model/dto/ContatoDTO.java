package com.viniciostorres.RHFast.comunicacao.model.dto;

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

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getEmpresa() { return empresa; }
    public void setEmpresa(String empresa) { this.empresa = empresa; }
    public long getMensagensNaoLidas() { return mensagensNaoLidas; }
    public void setMensagensNaoLidas(long mensagensNaoLidas) { this.mensagensNaoLidas = mensagensNaoLidas; }
}