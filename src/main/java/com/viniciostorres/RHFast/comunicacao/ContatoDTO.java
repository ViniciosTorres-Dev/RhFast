package com.viniciostorres.RHFast.comunicacao;

public class ContatoDTO {
    private Long id;
    private String nome;
    private String tipo; // "RECRUTADOR" ou "CANDIDATO"
    private String ultimaMensagem;
    private String dataUltimaMensagem;

    public ContatoDTO(Long id, String nome, String tipo, String ultimaMensagem, String dataUltimaMensagem) {
        this.id = id;
        this.nome = nome;
        this.tipo = tipo;
        this.ultimaMensagem = ultimaMensagem;
        this.dataUltimaMensagem = dataUltimaMensagem;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getUltimaMensagem() { return ultimaMensagem; }
    public void setUltimaMensagem(String ultimaMensagem) { this.ultimaMensagem = ultimaMensagem; }
    public String getDataUltimaMensagem() { return dataUltimaMensagem; }
    public void setDataUltimaMensagem(String dataUltimaMensagem) { this.dataUltimaMensagem = dataUltimaMensagem; }
}
