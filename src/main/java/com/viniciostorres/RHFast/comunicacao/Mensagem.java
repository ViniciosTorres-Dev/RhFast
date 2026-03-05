package com.viniciostorres.RHFast.comunicacao;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long remetenteId;
    private String remetenteTipo; // "RECRUTADOR" ou "CANDIDATO"

    private Long destinatarioId;
    private String destinatarioTipo; // "RECRUTADOR" ou "CANDIDATO"

    @Column(columnDefinition = "TEXT")
    private String conteudo;

    private LocalDateTime dataEnvio;

    public Mensagem() {
        this.dataEnvio = LocalDateTime.now();
    }

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRemetenteId() {
        return remetenteId;
    }

    public void setRemetenteId(Long remetenteId) {
        this.remetenteId = remetenteId;
    }

    public String getRemetenteTipo() {
        return remetenteTipo;
    }

    public void setRemetenteTipo(String remetenteTipo) {
        this.remetenteTipo = remetenteTipo;
    }

    public Long getDestinatarioId() {
        return destinatarioId;
    }

    public void setDestinatarioId(Long destinatarioId) {
        this.destinatarioId = destinatarioId;
    }

    public String getDestinatarioTipo() {
        return destinatarioTipo;
    }

    public void setDestinatarioTipo(String destinatarioTipo) {
        this.destinatarioTipo = destinatarioTipo;
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }

    public LocalDateTime getDataEnvio() {
        return dataEnvio;
    }

    public void setDataEnvio(LocalDateTime dataEnvio) {
        this.dataEnvio = dataEnvio;
    }
}
