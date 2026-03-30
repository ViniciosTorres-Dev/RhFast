package com.viniciostorres.RHFast.comunicacao.model;

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

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean lida = false;

    // Novos campos para controle de exclusão (soft delete)
    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean apagadaParaRemetente = false;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean apagadaParaDestinatario = false;

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

    public boolean isLida() {
        return lida;
    }

    public void setLida(boolean lida) {
        this.lida = lida;
    }

    public boolean isApagadaParaRemetente() {
        return apagadaParaRemetente;
    }

    public void setApagadaParaRemetente(boolean apagadaParaRemetente) {
        this.apagadaParaRemetente = apagadaParaRemetente;
    }

    public boolean isApagadaParaDestinatario() {
        return apagadaParaDestinatario;
    }

    public void setApagadaParaDestinatario(boolean apagadaParaDestinatario) {
        this.apagadaParaDestinatario = apagadaParaDestinatario;
    }
}